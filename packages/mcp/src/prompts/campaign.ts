/**
 * Campaign Prompts - Interactive Campaign Management
 *
 * Provides interactive prompts for real-time campaign management:
 * - "fuzzy-search" - Find NPCs, factions, and quests with intelligent search
 * - "generate-npc-dialogue" - Context-aware dialogue generation
 * - "adapt-quest" - Dynamic quest adaptation when players go off-script
 * - "faction-response" - Generate faction reactions to player actions
 * - "conversational-npc-creation" - Step-by-step guided NPC creation
 * - "help-prompts" - Interactive help system
 */

import { tables } from "@tome-master/shared"
import { eq, sql } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from ".."
import { gatherNPCCreationContext } from "./npc"
import { gatherQuestCreationContext } from "./quest"
import {
	createPromptResult,
	createResourceMessage,
	createTextMessage,
	extractArgsFromZodSchema,
	type GetPromptResult,
	type PromptDefinition,
} from "./types"

const searchBySimilarity = async (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 2,
) =>
	await db.execute(sql`
    SELECT id, name, source_table FROM search_fuzzy_combined(
      ${searchTerm},
      ${fuzzyWeight},
      ${similarityThreshold},
      ${maxLevenshtein},
      ${phoneticStrength}
    ) limit 10
  `)

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

// Enhanced creation schemas
const createFactionEnhancedSchema = z.object({
	name: z.string().describe("Faction name"),
	type_hint: z.string().optional().describe("Type of organization (military, trade, religious, criminal, etc.)"),
	location_hint: z.string().optional().describe("Where they're based or operate"),
	alignment_hint: z.string().optional().describe("Moral alignment preference"),
	role_hint: z.string().optional().describe("Role in campaign (ally, enemy, neutral, etc.)"),
})

const createLocationEnhancedSchema = z.object({
	name: z.string().describe("Location name"),
	type_hint: z.string().optional().describe("Type of place (city, town, village, fortress, dungeon, etc.)"),
	region_hint: z.string().optional().describe("Which region or area it's in"),
	size_hint: z.string().optional().describe("Relative size (small, medium, large, etc.)"),
	purpose_hint: z.string().optional().describe("Primary function (trade hub, military outpost, etc.)"),
})

const createQuestEnhancedSchema = z.object({
	name: z.string().describe("Quest name"),
	type_hint: z.string().optional().describe("Quest type (main, side, faction, personal, etc.)"),
	level_hint: z.string().optional().describe("Difficulty or character level range"),
	location_hint: z.string().optional().describe("Primary location or region"),
	faction_hint: z.string().optional().describe("Faction involved or requesting"),
	theme_hint: z.string().optional().describe("Quest theme (investigation, combat, diplomacy, etc.)"),
})

const promptHelpSchema = z.object({
	category: z.string().optional().describe("Filter by category (npc, faction, quest, location, all)"),
	prompt_name: z.string().optional().describe("Get help for specific prompt"),
	show_examples: z.boolean().default(false).describe("Include usage examples"),
})

// Add after the existing schema definitions

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

// Enhanced creation handlers
const handleCreateFactionEnhanced = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = createFactionEnhancedSchema.parse(args)
	logger.info("Creating enhanced faction", args)

	// Build faction creation context
	const contextResource = {
		faction_creation: {
			name: validatedArgs.name,
			type_hint: validatedArgs.type_hint,
			location_hint: validatedArgs.location_hint,
			alignment_hint: validatedArgs.alignment_hint,
			role_hint: validatedArgs.role_hint,
		},
		campaign_context: {
			existing_factions: "Auto-gathered from campaign database",
			political_landscape: "Current faction relationships and conflicts",
			geographic_context: "Regional control and territorial disputes",
		},
	}

	const promptText = `Create enhanced faction: "${validatedArgs.name}"

Type hint: ${validatedArgs.type_hint || "Flexible"}
Location hint: ${validatedArgs.location_hint || "No preference"}
Alignment hint: ${validatedArgs.alignment_hint || "Flexible"}
Role hint: ${validatedArgs.role_hint || "Flexible"}

Generate a complete faction including:
1. Organization structure and leadership hierarchy
2. Core values, goals, and methods
3. Territory, resources, and power base
4. Relationship suggestions with existing factions
5. Internal politics and potential conflicts
6. Recruitment methods and membership requirements
7. Public perception vs hidden agendas
8. Quest hooks and story integration opportunities

Use the campaign context to ensure this faction fits naturally into the existing political landscape.`

	return createPromptResult(
		[
			createResourceMessage(
				"user",
				`campaign://creation-context/faction-${validatedArgs.name}`,
				JSON.stringify(contextResource, null, 2),
			),
			createTextMessage("user", promptText),
		],
		`Enhanced faction creation for: ${validatedArgs.name}`,
	)
}

const handleCreateLocationEnhanced = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = createLocationEnhancedSchema.parse(args)
	logger.info("Creating enhanced location", args)

	const contextResource = {
		location_creation: {
			name: validatedArgs.name,
			type_hint: validatedArgs.type_hint,
			region_hint: validatedArgs.region_hint,
			size_hint: validatedArgs.size_hint,
			purpose_hint: validatedArgs.purpose_hint,
		},
		campaign_context: {
			existing_locations: "Auto-gathered from campaign database",
			geographic_connections: "Trade routes and travel networks",
			faction_control: "Political influence and territorial claims",
		},
	}

	const promptText = `Create enhanced location: "${validatedArgs.name}"

Type hint: ${validatedArgs.type_hint || "Flexible"}
Region hint: ${validatedArgs.region_hint || "No preference"}
Size hint: ${validatedArgs.size_hint || "Flexible"}
Purpose hint: ${validatedArgs.purpose_hint || "Flexible"}

Generate a complete location including:
1. Physical description and distinctive features
2. Population, demographics, and culture
3. Economic activities and trade connections
4. Political control and faction influence
5. Notable NPCs and key figures
6. Connections to existing locations
7. Adventure sites and points of interest
8. Quest hooks and story opportunities

Use the campaign context to integrate this location with existing geography and politics.`

	return createPromptResult(
		[
			createResourceMessage(
				"user",
				`campaign://creation-context/location-${validatedArgs.name}`,
				JSON.stringify(contextResource, null, 2),
			),
			createTextMessage("user", promptText),
		],
		`Enhanced location creation for: ${validatedArgs.name}`,
	)
}

const handleCreateQuestEnhanced = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = createQuestEnhancedSchema.parse(args)
	logger.info("Creating enhanced quest", args)

	const contextResource = {
		quest_creation: {
			name: validatedArgs.name,
			type_hint: validatedArgs.type_hint,
			level_hint: validatedArgs.level_hint,
			location_hint: validatedArgs.location_hint,
			faction_hint: validatedArgs.faction_hint,
			theme_hint: validatedArgs.theme_hint,
		},
		campaign_context: {
			existing_quests: "Active and completed quest lines",
			faction_dynamics: "Current conflicts and alliances",
			npc_relationships: "Key characters and their motivations",
			location_details: "Available adventure sites and regions",
		},
	}

	const promptText = `Create enhanced quest: "${validatedArgs.name}"

Type hint: ${validatedArgs.type_hint || "Flexible"}
Level hint: ${validatedArgs.level_hint || "Flexible"}
Location hint: ${validatedArgs.location_hint || "No preference"}
Faction hint: ${validatedArgs.faction_hint || "No preference"}
Theme hint: ${validatedArgs.theme_hint || "Flexible"}

Generate a complete quest including:
1. Clear objectives and success conditions
2. Multiple solution paths and approaches
3. Key NPCs and their roles
4. Locations and encounter sites
5. Faction involvement and political consequences
6. Complications and potential twists
7. Rewards and long-term impacts
8. Connections to existing storylines

Use the campaign context to weave this quest into the ongoing narrative and faction dynamics.`

	return createPromptResult(
		[
			createResourceMessage(
				"user",
				`campaign://creation-context/quest-${validatedArgs.name}`,
				JSON.stringify(contextResource, null, 2),
			),
			createTextMessage("user", promptText),
		],
		`Enhanced quest creation for: ${validatedArgs.name}`,
	)
}

const handlePromptHelp = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = promptHelpSchema.parse(args)
	logger.info("Providing prompt help", args)

	const allPrompts = {
		npc: [
			{
				name: "create-npc",
				description: "Create rich, connected NPCs with automatic relationship suggestions",
				performance: "8.3x content improvement • 1.0KB context • 157ms",
				args: [
					"name (required)",
					"occupation (optional)",
					"location_hint (optional)",
					"faction_hint (optional)",
					"role_hint (optional)",
				],
			},
			{
				name: "generate_npc_dialogue",
				description: "Generate contextual NPC dialogue with full campaign awareness",
				args: ["npc_name (fuzzy search)", "player_query", "emotional_state (optional)"],
			},
		],
		faction: [
			{
				name: "create-faction",
				description: "Generate political organizations with territory and power dynamics",
				performance: "11x content improvement • 1.3KB context • 137ms",
				args: [
					"name (required)",
					"type_hint (optional)",
					"location_hint (optional)",
					"alignment_hint (optional)",
					"role_hint (optional)",
				],
			},
			{
				name: "faction_response",
				description: "Generate faction responses to player actions with political consequences",
				args: ["faction_name (fuzzy search)", "player_action", "response_urgency (optional)"],
			},
		],
		location: [
			{
				name: "create-location",
				description: "Build detailed locations with geographic and political integration",
				performance: "12.3x content improvement • 0.9KB context • 247ms",
				args: [
					"name (required)",
					"type_hint (optional)",
					"region_hint (optional)",
					"size_hint (optional)",
					"purpose_hint (optional)",
				],
			},
		],
		quest: [
			{
				name: "create-quest",
				description: "Design multi-layered quests with narrative consequences",
				performance: "11.4x content improvement • 1.4KB context • 233ms",
				args: [
					"name (required)",
					"type_hint (optional)",
					"level_hint (optional)",
					"location_hint (optional)",
					"faction_hint (optional)",
					"theme_hint (optional)",
				],
			},
			{
				name: "adapt_quest_progression",
				description: "Adapt quest progression when players take unexpected actions",
				args: ["quest_name (fuzzy search)", "unexpected_action", "preserve_themes (optional)"],
			},
		],
	}

	let helpText = "# 🌟 Enhanced Campaign Prompts Help\n\n"

	if (validatedArgs.prompt_name) {
		// Specific prompt help
		const foundPrompt = Object.values(allPrompts)
			.flat()
			.find((p) => p.name === validatedArgs.prompt_name)
		if (foundPrompt) {
			helpText += `## ${foundPrompt.name}\n\n`
			helpText += `**Description:** ${foundPrompt.description}\n\n`
			if (foundPrompt.performance) {
				helpText += `**Performance:** ${foundPrompt.performance}\n\n`
			}
			helpText += `**Arguments:**\n${foundPrompt.args.map((arg) => `- ${arg}`).join("\n")}\n\n`

			if (validatedArgs.show_examples) {
				helpText += `**Example Usage:**\n\`\`\`json\n{\n  "prompt": "${foundPrompt.name}",\n  "args": {\n    // Add your arguments here\n  }\n}\n\`\`\`\n\n`
			}
		} else {
			helpText += `❌ Prompt "${validatedArgs.prompt_name}" not found.\n\n`
		}
	} else if (validatedArgs.category && validatedArgs.category !== "all") {
		// Category-specific help
		const categoryPrompts = allPrompts[validatedArgs.category as keyof typeof allPrompts]
		if (categoryPrompts) {
			helpText += `## ${validatedArgs.category.toUpperCase()} Prompts\n\n`
			categoryPrompts.forEach((prompt) => {
				helpText += `### ${prompt.name}\n`
				helpText += `${prompt.description}\n\n`
				if (prompt.performance) {
					helpText += `**Performance:** ${prompt.performance}\n\n`
				}
			})
		}
	} else {
		// All prompts overview
		helpText += "## Available Enhanced Prompts\n\n"
		helpText += "**✅ Proven Results:** 974.3% content improvement over basic prompts!\n\n"

		Object.entries(allPrompts).forEach(([category, prompts]) => {
			helpText += `### ${category.toUpperCase()} (${prompts.length} prompts)\n`
			prompts.forEach((prompt) => {
				helpText += `- **${prompt.name}**: ${prompt.description}\n`
			})
			helpText += "\n"
		})

		helpText += "**Get specific help:** Use `prompt_name` parameter for detailed information.\n"
		helpText += "**See examples:** Add `show_examples: true` for usage examples.\n"
	}

	return createPromptResult([createTextMessage("assistant", helpText)], "Enhanced prompts help and documentation")
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

// Add new schema for conversational NPC creation
const conversationalNpcCreationSchema = z.object({
	step: z.enum(["start", "concept", "background", "relationships", "finalize"]),
	npc_name: z.string(),
	previous_choices: z.record(z.string(), z.any()).optional(),
})

// Add new handler for conversational NPC creation
const handleConversationalNpcCreation = async (args: unknown): Promise<GetPromptResult> => {
	const validatedArgs = conversationalNpcCreationSchema.parse(args)
	logger.info("Conversational NPC creation step", validatedArgs)

	const { step, npc_name, previous_choices = {} } = validatedArgs

	switch (step) {
		case "start":
			return createPromptResult([
				createTextMessage(
					"user",
					`I want to create a new NPC named "${npc_name}". Can you help me develop them through a conversation?`,
				),
				createTextMessage(
					"assistant",
					`🎭 **Creating NPC: "${npc_name}"**

I'd love to help you bring ${npc_name} to life! Let's start with the basics and build from there.

**What's your initial vision for ${npc_name}?**
- What role do they play in your world? (merchant, noble, guard, scholar, etc.)
- What's their general personality like?
- Any specific traits or quirks that come to mind?

Don't worry about being complete - we'll develop them together step by step!`,
				),
				createTextMessage(
					"user",
					`I'm thinking ${npc_name} could be a mysterious scholar who knows more than they let on.`,
				),
			])

		case "concept":
			return createPromptResult([
				createTextMessage(
					"user",
					`My concept for ${npc_name}: ${previous_choices.concept || "mysterious scholar who knows more than they let on"}`,
				),
				createTextMessage(
					"assistant",
					`📚 **Excellent concept!** A mysterious scholar with hidden knowledge is perfect for creating intrigue.

**Let's dig deeper into ${npc_name}'s background:**
- What field do they study? (ancient history, magic, politics, etc.)
- What secret knowledge do they possess?
- Why do they keep it hidden?
- How did they acquire this knowledge?

This will help us understand what makes them tick and how they might interact with your players.`,
				),
				createTextMessage(
					"user",
					`${npc_name} studies ancient magical artifacts and knows the location of a powerful lost relic, but they're hiding it because they fear what would happen if it fell into the wrong hands.`,
				),
			])

		case "background": {
			// Search for related campaign elements
			const factionSearch = await smartEntitySearch(npc_name, "faction", 3)
			const questSearch = await smartEntitySearch("ancient magical artifacts", "quest", 3)

			const campaignContext = {
				relatedFactions: factionSearch.results,
				relatedQuests: questSearch.results,
				npc_name,
				background: previous_choices.background,
			}

			return createPromptResult([
				createResourceMessage("user", `campaign://npc-context/${npc_name}`, JSON.stringify(campaignContext, null, 2)),
				createTextMessage(
					"user",
					`${npc_name}'s background: ${previous_choices.background || "Studies ancient magical artifacts, knows location of powerful lost relic, hiding it for safety"}`,
				),
				createTextMessage(
					"assistant",
					`🔍 **Great background!** Now let's connect ${npc_name} to your existing campaign.

Looking at your campaign, I can see some interesting connections:

**Potential Relationships:**
${
	factionSearch.results.length > 0
		? `- **Factions**: ${factionSearch.results.map((f) => f.name).join(", ")} might be interested in ${npc_name}'s knowledge`
		: "- No obvious faction connections yet - we could create some!"
}

${
	questSearch.results.length > 0
		? `- **Existing Quests**: ${questSearch.results.map((q) => q.name).join(", ")} might relate to their research`
		: "- This could be the seed for a new quest line!"
}

**Questions to consider:**
- Who else knows about ${npc_name}'s secret?
- Are there any factions or individuals actively seeking this knowledge?
- Does ${npc_name} have allies or enemies?
- What would make them trust the party enough to share their secret?`,
				),
				createTextMessage(
					"user",
					`I think ${npc_name} has a rival scholar who suspects they're hiding something important, and there's a faction that would do anything to get their hands on the relic.`,
				),
			])
		}

		case "relationships":
			return createPromptResult([
				createTextMessage(
					"user",
					`${npc_name}'s relationships: ${previous_choices.relationships || "Has a rival scholar who suspects their secret, and a dangerous faction seeks the relic"}`,
				),
				createTextMessage(
					"assistant",
					`🕸️ **Perfect! These relationships create excellent dramatic tension.**

**Final touches for ${npc_name}:**
- **Personality quirks**: How do they act when nervous? Any habits or mannerisms?
- **Dialogue style**: Formal and academic? Cryptic and mysterious? Friendly but guarded?
- **Physical appearance**: What makes them memorable?
- **Goals**: Beyond hiding the relic, what do they want to achieve?

Once we nail these details, I'll generate a complete NPC profile that fits seamlessly into your campaign!`,
				),
				createTextMessage(
					"user",
					`${npc_name} nervously adjusts their spectacles when lying, speaks in riddles when discussing their research, has ink-stained fingers, and secretly hopes to find a worthy successor to pass their knowledge to.`,
				),
			])

		case "finalize": {
			// Gather full campaign context for final NPC creation
			const fullContext = await gatherNPCCreationContext({
				name: npc_name,
				occupation: "scholar",
				faction_hint: previous_choices.factions,
				location_hint: previous_choices.location,
			})

			return createPromptResult([
				createResourceMessage(
					"user",
					`campaign://npc-creation/${npc_name}`,
					JSON.stringify({ ...fullContext, conversation_choices: previous_choices }, null, 2),
				),
				createTextMessage(
					"user",
					`🎭 **Complete NPC Creation for "${npc_name}"**

**Concept**: ${previous_choices.concept || "Mysterious scholar"}
**Background**: ${previous_choices.background || "Studies ancient magical artifacts, guards secret relic location"}
**Relationships**: ${previous_choices.relationships || "Rival scholar suspects secret, dangerous faction seeks relic"}
**Personality**: ${previous_choices.personality || "Adjusts spectacles when lying, speaks in riddles, ink-stained fingers, seeks worthy successor"}

Create a comprehensive NPC profile that includes:

1. **Complete stat block and background**
2. **Integration with existing campaign factions and conflicts**
3. **Specific dialogue examples and speech patterns**
4. **Plot hooks and quest opportunities**
5. **Relationship dynamics with other NPCs**
6. **Secrets and hidden motivations**
7. **How they might react to different player approaches**

Make ${npc_name} feel like a living, breathing part of the campaign world with clear connections to ongoing storylines.`,
				),
			])
		}

		default:
			return createPromptResult([createTextMessage("assistant", "❌ Unknown step. Please start with step: 'start'")])
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

	// Enhanced creation prompts (matching the guide)
	"create-faction": {
		description: "Generate political organizations with territory and power dynamics",
		schema: createFactionEnhancedSchema,
		handler: handleCreateFactionEnhanced,
		arguments: extractArgsFromZodSchema(createFactionEnhancedSchema),
	},
	"create-location": {
		description: "Build detailed locations with geographic and political integration",
		schema: createLocationEnhancedSchema,
		handler: handleCreateLocationEnhanced,
		arguments: extractArgsFromZodSchema(createLocationEnhancedSchema),
	},
	"create-quest": {
		description: "Design multi-layered quests with narrative consequences",
		schema: createQuestEnhancedSchema,
		handler: handleCreateQuestEnhanced,
		arguments: extractArgsFromZodSchema(createQuestEnhancedSchema),
	},

	// Help system
	"prompt-help": {
		description: "Get help with available enhanced prompts, organized by category",
		schema: promptHelpSchema,
		handler: handlePromptHelp,
		arguments: extractArgsFromZodSchema(promptHelpSchema),
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

	// Conversational NPC creation
	"conversational-npc-creation": {
		description: "Multi-step conversation to create a new NPC",
		schema: conversationalNpcCreationSchema,
		handler: handleConversationalNpcCreation,
		arguments: extractArgsFromZodSchema(conversationalNpcCreationSchema),
	},
} satisfies Record<string, PromptDefinition<z.ZodTypeAny>>
