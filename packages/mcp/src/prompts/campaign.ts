/**
 * Campaign Prompts - Interactive Campaign Management
 *
 * Provides interactive prompts for real-time campaign management:
 * - "generate-npc-dialogue" - Context-aware dialogue generation
 * - "adapt-quest" - Dynamic quest adaptation when players go off-script
 * - "faction-response" - Generate faction reactions to player actions
 */

import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from ".."
// Import centralized search function
import { searchBySimilarity } from "../tools/utils/search"
import { gatherQuestCreationContext } from "./quest"
import {
	createPromptResult,
	createResourceMessage,
	createTextMessage,
	extractArgsFromZodSchema,
	type GetPromptResult,
	type PromptDefinition,
} from "./types"

const fuzzySearchEntities = async (query: string, entityType?: string) => {
	const { rows } = await searchBySimilarity(query)

	let filteredRows = rows as Array<{ id: number; name: string; source_table: string }>
	if (entityType) {
		filteredRows = filteredRows.filter((row) => row.source_table === entityType)
	}

	const results = await Promise.all(
		filteredRows.map(async (row) => {
			try {
				switch (row.source_table) {
					case "npcs": {
						const npc = await db.query.npcs.findFirst({
							where: eq(tables.npcTables.npcs.id, row.id),
							columns: { id: true, name: true, occupation: true },
							with: {
								siteAssociations: {
									with: { site: { columns: { name: true } } },
								},
							},
						})
						return npc
							? {
									...npc,
									source_table: "npcs",
									location: npc.siteAssociations[0]?.site?.name || "Unknown location",
								}
							: null
					}

					case "factions": {
						const faction = await db.query.factions.findFirst({
							where: eq(tables.factionTables.factions.id, row.id),
							columns: { id: true, name: true, type: true, publicAlignment: true, secretAlignment: true },
						})
						return faction ? { ...faction, source_table: "factions" } : null
					}

					case "quests": {
						const quest = await db.query.quests.findFirst({
							where: eq(tables.questTables.quests.id, row.id),
							columns: { id: true, name: true, urgency: true, type: true },
						})
						return quest ? { ...quest, source_table: "quests" } : null
					}

					default:
						return { ...row }
				}
			} catch (error) {
				logger.warn(`Failed to enhance ${row.source_table} entity ${row.id}`, { error })
				return { ...row }
			}
		}),
	)

	return results.filter(Boolean)
}

// Entity-specific fuzzy search functions
const fuzzySearchNPCs = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "npcs").then((results) => results.slice(0, limit))
}

const fuzzySearchFactions = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "factions").then((results) => results.slice(0, limit))
}

const fuzzySearchQuests = async (query: string, limit = 5) => {
	return fuzzySearchEntities(query, "quests").then((results) => results.slice(0, limit))
}

// Hybrid smart search: fuzzy first, then embedding fallback
const smartEntitySearch = async (query: string, entityType: "npc" | "faction" | "quest", limit = 5) => {
	logger.info(`Smart search for ${entityType}: "${query}"`)

	// Step 1: Try fuzzy search first
	// biome-ignore lint/suspicious/noExplicitAny: <AI sucks>
	let fuzzyResults: any[] = []
	switch (entityType) {
		case "npc":
			fuzzyResults = await fuzzySearchNPCs(query, limit)
			break
		case "faction":
			fuzzyResults = await fuzzySearchFactions(query, limit)
			break
		case "quest":
			fuzzyResults = await fuzzySearchQuests(query, limit)
			break
	}

	if (fuzzyResults.length > 0) {
		return {
			method: "fuzzy" as const,
			results: fuzzyResults,
			query,
		}
	}

	// No results found
	return {
		method: "none" as const,
		results: [],
		query,
	}
}

// Build comprehensive NPC context for dialogue
const buildNPCDialogueContext = async (npcId: number, playerQuery: string) => {
	// Simple basic query first to avoid schema issues
	const npcContext = await db.query.npcs.findFirst({
		where: eq(tables.npcTables.npcs.id, npcId),
		columns: {
			id: true,
			name: true,
			occupation: true,
			alignment: true,
			secrets: true,
			// Add basic properties available in NPC schema
			gender: true,
			race: true,
			trustLevel: true,
			disposition: true,
		},
	})

	if (!npcContext) {
		throw new Error(`NPC with ID ${npcId} not found`)
	}

	const contextResource = {
		npc_basic: {
			name: npcContext.name,
			occupation: npcContext.occupation,
			alignment: npcContext.alignment,
			gender: npcContext.gender,
			race: npcContext.race,
			trustLevel: npcContext.trustLevel,
			disposition: npcContext.disposition,
			secrets: Array.isArray(npcContext.secrets) ? npcContext.secrets.join(", ") : npcContext.secrets,
		},
		campaign_context: {
			player_query: playerQuery,
			interaction_context: "The player is interacting with this NPC",
		},
	}

	return [
		createResourceMessage(
			"user",
			`campaign://npc-dialogue-context/${npcId}`,
			JSON.stringify(contextResource, null, 2),
			"application/json",
		),
		createTextMessage(
			"user",
			`Player says to ${npcContext.name}: "${playerQuery}"\n\nGenerate authentic dialogue that reflects this NPC's personality, current situation, faction loyalties, and relationships. Consider their secrets and motivations when crafting the response.`,
		),
	]
}

// Schema definitions
const npcDialogueSchema = z.object({
	npc_name: z.string().describe("NPC name (fuzzy search supported - partial names OK)"),
	player_query: z.string().describe("What the player says or asks the NPC"),
	emotional_state: z.string().optional().describe("NPC's current emotional state if relevant"),
})

const questAdaptationSchema = z.object({
	quest_name: z.string().describe("Quest name (fuzzy search supported)"),
	unexpected_action: z.string().describe("What unexpected action did the players take?"),
	preserve_themes: z.boolean().default(true).describe("Try to preserve the original quest themes"),
})

const factionResponseSchema = z.object({
	faction_name: z.string().describe("Faction name (fuzzy search supported)"),
	player_action: z.string().describe("What action did the players take that affects this faction?"),
	response_urgency: z.enum(["immediate", "next_session", "background"]).default("next_session"),
})

const questWorkflowSchema = z.object({
	step: z.enum(["start", "objectives", "npcs", "locations", "complications"]).default("start"),
	quest_name: z.string().describe("Quest name"),
	previous_choices: z.record(z.string(), z.any()).optional().describe("Choices made in previous steps"),
})

// Enhanced prompt handlers with hybrid search
const handleNPCDialogue = async (args: unknown): Promise<GetPromptResult> => {
	const parseResult = npcDialogueSchema.safeParse(args)
	if (!parseResult.success) {
		return createPromptResult(
			[createTextMessage("assistant", `❌ Invalid arguments: ${parseResult.error.message}`)],
			"Invalid arguments for NPC dialogue",
		)
	}

	const validatedArgs = parseResult.data
	logger.info("Generating NPC dialogue with smart search", validatedArgs)

	const searchResult = await smartEntitySearch(validatedArgs.npc_name, "npc")

	if (searchResult.results.length === 0) {
		return createPromptResult(
			[
				createTextMessage(
					"assistant",
					`❌ No NPCs found matching "${validatedArgs.npc_name}". Try:\n- Different spelling or partial names (fuzzy search)\n- Descriptive terms like "corrupt noble" or "nervous blacksmith" (semantic search)\n- Character traits, occupations, or plot roles`,
				),
			],
			`No NPC matches for "${validatedArgs.npc_name}"`,
		)
	}

	if (searchResult.results.length === 1) {
		// Perfect match - generate context-rich dialogue
		const npc = searchResult.results[0]
		const dialogueContext = await buildNPCDialogueContext(npc.id, validatedArgs.player_query)
		return createPromptResult(dialogueContext, `NPC dialogue for ${npc.name} (found via ${searchResult.method} search)`)
	}

	// Multiple matches - help user choose
	const matchList = searchResult.results
		.map((npc, i) => `${i + 1}. **${npc.name}** (${npc.occupation || "Unknown role"}) - ${npc.location}`)
		.join("\n")

	return {
		messages: [
			{
				role: "assistant",
				content: {
					type: "text",
					text: `🔍 Found ${searchResult.results.length} NPCs via ${searchResult.method} search for "${validatedArgs.npc_name}":\n\n${matchList}\n\n**To continue:**\n- Use the exact name from the list above\n- Or try running this prompt again with more specific details`,
				},
			},
		],
		description: `Multiple NPC matches for "${validatedArgs.npc_name}" (${searchResult.method} search)`,
	}
}

const handleQuestAdaptation = async (args: unknown): Promise<GetPromptResult> => {
	const parseResult = questAdaptationSchema.safeParse(args)
	if (!parseResult.success) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ Invalid arguments: ${parseResult.error.message}`,
					},
				},
			],
			description: "Invalid arguments for quest adaptation",
		}
	}

	const validatedArgs = parseResult.data
	logger.info("Adapting quest with smart search", validatedArgs)

	const searchResult = await smartEntitySearch(validatedArgs.quest_name, "quest")

	if (searchResult.results.length === 0) {
		return {
			messages: [
				{
					role: "assistant",
					content: {
						type: "text",
						text: `❌ No quests found matching "${validatedArgs.quest_name}". Try checking active quests or using partial names.`,
					},
				},
			],
			description: `No quest matches for "${validatedArgs.quest_name}"`,
		}
	}

	if (searchResult.results.length === 1) {
		// Build quest context and adaptation guidance
		const quest = searchResult.results[0]
		// Could expand this with full quest context similar to NPC dialogue
		return {
			messages: [
				{
					role: "user",
					content: {
						type: "text",
						text: `Quest "${quest.name}" (${quest.status}) needs adaptation.\n\nUnexpected player action: "${validatedArgs.unexpected_action}"\n\nHow can I adapt this quest while ${validatedArgs.preserve_themes ? "preserving the original themes" : "allowing complete pivoting"}? Provide specific suggestions for next steps.`,
					},
				},
			],
			description: `Quest adaptation for ${quest.name} (found via ${searchResult.method} search)`,
		}
	}

	// Multiple matches
	const matchList = searchResult.results
		.map((quest, i) => `${i + 1}. **${quest.name}** (${quest.status}) - ${quest.type} quest`)
		.join("\n")

	return {
		messages: [
			{
				role: "assistant",
				content: {
					type: "text",
					text: `🔍 Found ${searchResult.results.length} quests via ${searchResult.method} search for "${validatedArgs.quest_name}":\n\n${matchList}\n\nPlease run the prompt again with the exact quest name from above.`,
				},
			},
		],
		description: `Multiple quest matches for "${validatedArgs.quest_name}" (${searchResult.method} search)`,
	}
}

const handleFactionResponse = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = factionResponseSchema.parse(args)
	logger.info("Generating faction response", args)

	const searchResult = await smartEntitySearch(validatedArgs.faction_name, "faction")

	if (searchResult.results.length === 0) {
		return createPromptResult(
			[
				createTextMessage(
					"assistant",
					`❌ No factions found matching "${validatedArgs.faction_name}". Try checking existing factions or using partial names.`,
				),
			],
			`No faction matches for "${validatedArgs.faction_name}"`,
		)
	}

	if (searchResult.results.length === 1) {
		const faction = searchResult.results[0]
		const contextResource = {
			faction_response: {
				faction_name: faction.name,
				faction_type: faction.type,
				faction_alignment: faction.alignment,
				player_action: validatedArgs.player_action,
				response_urgency: validatedArgs.response_urgency,
			},
			campaign_context: {
				faction_relationships: "Current alliances and rivalries",
				political_situation: "Broader political landscape",
				ongoing_conflicts: "Active conflicts and tensions",
			},
		}

		const promptText = `Faction Response: ${faction.name}

Player Action: "${validatedArgs.player_action}"
Response Urgency: ${validatedArgs.response_urgency}

Generate a faction response including:
1. Immediate reaction to the player action
2. Internal faction discussions and decision-making
3. Public vs private responses
4. Impact on faction goals and relationships
5. Specific actions the faction will take
6. Timeline for response (${validatedArgs.response_urgency})
7. Consequences for future interactions
8. Opportunities for player involvement

Consider the faction's type (${faction.type}), alignment (${faction.alignment}), and current political situation.`

		return createPromptResult(
			[
				createResourceMessage(
					"user",
					`campaign://faction-response/${faction.name}`,
					JSON.stringify(contextResource, null, 2),
				),
				createTextMessage("user", promptText),
			],
			`Faction response for ${faction.name} (found via ${searchResult.method} search)`,
		)
	}

	// Multiple matches
	const matchList = searchResult.results
		.map((faction, i) => `${i + 1}. **${faction.name}** (${faction.type}) - ${faction.alignment}`)
		.join("\n")

	return createPromptResult(
		[
			createTextMessage(
				"assistant",
				`🔍 Found ${searchResult.results.length} factions via ${searchResult.method} search for "${validatedArgs.faction_name}":\n\n${matchList}\n\nPlease run the prompt again with the exact faction name from above.`,
			),
		],
		`Multiple faction matches for "${validatedArgs.faction_name}" (${searchResult.method} search)`,
	)
}

// Add the handler after existing handlers

const handleQuestWorkflow = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = questWorkflowSchema.parse(args)
	logger.info("Quest workflow step", validatedArgs)

	const { step, quest_name, previous_choices = {} } = validatedArgs

	switch (step) {
		case "start":
			return createPromptResult([
				createTextMessage(
					"user",
					`I want to create a quest called "${quest_name}". Can you guide me through a step-by-step process to build it with full campaign integration?`,
				),
				createTextMessage(
					"assistant",
					`🎯 **Quest Creation Workflow: "${quest_name}"**

I'll guide you through creating this quest step by step to ensure maximum campaign integration.

**Step 1: Core Objectives**
What is the main goal of this quest? Consider:
- Investigation (uncover secrets, solve mysteries)
- Rescue (save someone or something important)
- Diplomacy (negotiate, build relationships)
- Combat (defeat enemies, clear threats)
- Exploration (discover new places, find artifacts)

Please tell me the primary objective and I'll help you develop it with campaign context.`,
				),
				createTextMessage("user", "I'd like to focus on investigation - uncovering secrets and solving mysteries."),
			])

		case "objectives":
			return createPromptResult([
				createTextMessage("user", `The quest objective is: ${previous_choices.objective || "investigation"}`),
				createTextMessage(
					"assistant",
					`✅ **Objective Set**: ${previous_choices.objective || "Investigation"}

**Step 2: Key NPCs**
Every great quest needs compelling characters. Based on your investigation objective, I recommend:

- **Quest Giver**: Someone with a mystery to solve
- **Information Source**: NPC who knows crucial details  
- **Antagonist**: Someone hiding the truth

Would you like me to suggest specific NPCs from your campaign, or shall we create new ones?`,
				),
				createTextMessage("user", "Please suggest existing NPCs from my campaign that could fill these roles."),
			])

		case "npcs": {
			// Get campaign NPCs for suggestions
			const searchResult = await smartEntitySearch(quest_name, "npc", 5)
			const npcSuggestions =
				searchResult.results.length > 0
					? searchResult.results.map((npc) => `- **${npc.name}** (${npc.occupation}) - ${npc.location}`).join("\n")
					: "No existing NPCs found - we'll create new ones!"

			return createPromptResult([
				createResourceMessage(
					"user",
					`campaign://npc-suggestions/quest-${quest_name}`,
					JSON.stringify({ searchResult, quest_name, objective: previous_choices.objective }, null, 2),
				),
				createTextMessage(
					"user",
					"Here are the existing NPCs in my campaign. Which ones would work well for this investigation quest?",
				),
				createTextMessage(
					"assistant",
					`👥 **NPC Integration Analysis**

**Existing NPCs that could be involved:**
${npcSuggestions}

Based on your investigation quest, I can see some excellent possibilities here. Let me analyze how these NPCs could fit into your mystery:

**Step 3: Locations**
Where will this investigation take place? Consider:
- Starting location (where players receive the quest)
- Investigation locations (where clues are discovered)
- Climax location (where the truth is revealed)

For investigation quests, I suggest locations that support information gathering and clue discovery.

What locations from your campaign should be involved?`,
				),
				createTextMessage(
					"user",
					"I want to use locations that create a sense of mystery and allow for multiple investigation paths.",
				),
			])
		}

		case "locations":
			return createPromptResult([
				createTextMessage(
					"user",
					`The locations I want to use are: ${previous_choices.locations || "mysterious locations that support investigation"}`,
				),
				createTextMessage(
					"assistant",
					`🏰 **Locations Planned**: ${previous_choices.locations || "Investigation-friendly locations"}

**Step 4: Complications & Twists**
Great investigation quests have unexpected developments. Based on your setup:

**Potential Complications:**
- False leads that misdirect the investigation
- Witnesses who lie or withhold information
- Evidence that points to multiple suspects
- Political pressure to close the case quickly
- The truth being more complex than it appears

**Final Step**: Ready to generate your complete quest with all campaign integrations?

I'll create a comprehensive quest document with:
✅ All your chosen elements
✅ Campaign entity integration  
✅ Multiple investigation paths
✅ Red herrings and plot twists
✅ Political consequences
✅ Future story hooks

Shall we proceed to generate the final quest?`,
				),
				createTextMessage("user", "Yes, please generate the complete quest with all the elements we've discussed."),
			])

		case "complications": {
			// Generate the final quest using the enhanced quest creation
			const finalContext = await gatherQuestCreationContext({
				name: quest_name,
				type_hint: previous_choices.type || "investigation",
				location_hint: previous_choices.locations,
				faction_hint: previous_choices.factions,
				theme_hint: previous_choices.objective || "investigation",
			})

			return createPromptResult([
				createResourceMessage(
					"user",
					`campaign://workflow-context/quest-${quest_name}`,
					JSON.stringify({ ...finalContext, workflow_choices: previous_choices }, null, 2),
				),
				createTextMessage(
					"user",
					`🎯 **Complete Quest Generation**

Quest: "${quest_name}"
Objective: ${previous_choices.objective || "Investigation"}
NPCs: ${previous_choices.npcs || "Campaign NPCs as suggested"}
Locations: ${previous_choices.locations || "Investigation-friendly locations"}
Complications: ${previous_choices.complications || "Investigation twists and red herrings"}

Generate a comprehensive investigation quest that incorporates all these elements with full campaign integration. Include:

1. **Detailed Quest Stages** with the chosen locations and NPCs
2. **Multiple Investigation Paths** with clues and red herrings
3. **Political Ramifications** involving relevant factions
4. **Complication Integration** that creates meaningful choices
5. **Campaign Connections** to existing storylines and conflicts
6. **Future Story Hooks** that emerge from quest outcomes

Make this quest feel like a natural part of the ongoing campaign narrative.`,
				),
			])
		}

		default:
			return createPromptResult([
				createTextMessage("assistant", "❌ Unknown workflow step. Please start with step: 'start'"),
			])
	}
}

// Export enhanced prompt definitions
export const enhancedCampaignPrompts = {
	// Interactive prompts
	generate_npc_dialogue: {
		description: "Generate contextual NPC dialogue with full campaign awareness (supports fuzzy name search)",
		schema: npcDialogueSchema,
		handler: handleNPCDialogue,
		arguments: extractArgsFromZodSchema(npcDialogueSchema),
	},
	adapt_quest_progression: {
		description: "Adapt quest progression when players take unexpected actions (supports fuzzy quest search)",
		schema: questAdaptationSchema,
		handler: handleQuestAdaptation,
		arguments: extractArgsFromZodSchema(questAdaptationSchema),
	},

	// Faction response system
	faction_response: {
		description: "Generate faction responses to player actions with political consequences",
		schema: factionResponseSchema,
		handler: handleFactionResponse,
		arguments: extractArgsFromZodSchema(factionResponseSchema),
	},

	// Quest workflow
	"quest-workflow": {
		description: "Multi-step guided quest creation workflow with campaign integration",
		schema: questWorkflowSchema,
		handler: handleQuestWorkflow,
		arguments: extractArgsFromZodSchema(questWorkflowSchema),
	},
} satisfies Record<string, PromptDefinition<z.ZodTypeAny>>
