/**
 * Quest Creation
 *
 * Provides the "create-quest-enhanced" prompt for generating complex adventures
 * with multi-stage development, faction involvement analysis, and automatic
 * integration with existing storylines and campaign conflicts.
 */

import { tables } from "@tome-master/shared"
import { eq, or, sql } from "drizzle-orm"
import { z } from "zod/v4"
import { db, logger } from ".."
import type { PromptDefinition } from "./utils"

// Fuzzy search function for better entity matching
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
    ) limit 5
  `)

const {
	conflictTables: { majorConflicts },
	factionTables: { factions },
	npcTables: { npcFactions },
	questTables: { quests },
} = tables

const enhancedQuestCreationSchema = z.object({
	name: z.string().describe("Name for the new quest"),
	type_hint: z.string().optional().describe("Type of quest (main, side, faction, personal, etc.)"),
	level_hint: z.string().optional().describe("Difficulty level or character level range"),
	location_hint: z.string().optional().describe("Primary location or region for the quest"),
	faction_hint: z.string().optional().describe("Faction involved in or requesting the quest"),
	theme_hint: z.string().optional().describe("Quest theme (investigation, combat, diplomacy, etc.)"),
})

async function gatherQuestCreationContext(args: z.infer<typeof enhancedQuestCreationSchema>) {
	logger.info("Gathering quest creation context", args)

	try {
		// Check for name conflicts using fuzzy search
		const { rows: nameConflictRows } = await searchBySimilarity(args.name, 1.0, 0.4, 3, 2)
		const questConflicts = nameConflictRows.filter((row: any) => row.source_table === "quests")

		// Get detailed info for conflicting quests
		const nameConflicts =
			questConflicts.length > 0
				? await db.query.quests.findMany({
						where: sql`${quests.id} IN (${sql.join(
							questConflicts.map((q: any) => q.id),
							sql`, `,
						)})`,
						columns: { id: true, name: true, type: true },
					})
				: []

		// Get existing quests for continuity and connections
		const existingQuests = await db.query.quests.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
			},
		})

		// Get quest stages for structure inspiration
		const recentQuestStages = await db.query.questStages.findMany({
			columns: {
				id: true,
				questId: true,
				name: true,
				description: true,
			},
		})

		// Get locations for quest settings
		const availableLocations = await db.query.sites.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				description: true,
			},
		})

		// Get factions for quest givers and opposition
		const availableFactions = await db.query.factions.findMany({
			columns: {
				id: true,
				name: true,
				type: true,
				publicAlignment: true,
				secretAlignment: true,
				description: true,
			},
		})

		// Get NPCs for quest givers, targets, and allies
		const availableNPCs = await db.query.npcs.findMany({
			columns: {
				id: true,
				name: true,
				occupation: true,
				alignment: true,
			},
		})

		// Get faction-specific entities if faction hint provided
		let factionContext: any = null
		if (args.faction_hint) {
			// Use fuzzy search to find factions
			const { rows: factionRows } = await searchBySimilarity(args.faction_hint, 1.0, 0.3, 2, 2)
			const factionMatches = factionRows.filter((row: any) => row.source_table === "factions")

			const relatedFactions =
				factionMatches.length > 0
					? await db.query.factions.findMany({
							where: sql`${factions.id} IN (${sql.join(
								factionMatches.map((f: any) => f.id),
								sql`, `,
							)})`,
							columns: {
								id: true,
								name: true,
								type: true,
								publicAlignment: true,
								secretAlignment: true,
								description: true,
							},
						})
					: []

			if (relatedFactions.length > 0) {
				const factionIds = relatedFactions.map((f) => f.id)

				// Get NPCs in the faction via junction table
				const factionNPCRelations = await db.query.npcFactions.findMany({
					where: or(...factionIds.map((id) => eq(npcFactions.factionId, id))),
					with: {
						npc: {
							columns: { id: true, name: true, occupation: true, alignment: true },
						},
					},
					limit: 8,
				})
				const factionNPCs = factionNPCRelations.map((rel) => rel.npc)

				factionContext = {
					factions: relatedFactions,
					members: factionNPCs,
				}
			}
		}

		// Get active conflicts for quest integration
		const activeConflicts = await db.query.majorConflicts.findMany({
			where: eq(majorConflicts.status, "active"),
			columns: {
				id: true,
				name: true,
				natures: true,
				description: true,
			},
			limit: 8,
		})

		// Generate quest connection suggestions
		const suggestedConnections = await generateQuestConnectionSuggestions(
			args,
			existingQuests,
			activeConflicts,
			availableFactions,
		)

		const context = {
			nameConflicts,
			existingQuests,
			recentQuestStages,
			availableLocations,
			availableFactions,
			availableNPCs,
			factionContext,
			activeConflicts,
			suggestedConnections,
		}

		logger.info("Quest context gathered successfully", {
			nameConflicts: nameConflicts.length,
			existingQuests: existingQuests.length,
			availableLocations: availableLocations.length,
			availableFactions: availableFactions.length,
			availableNPCs: availableNPCs.length,
			factionContext: factionContext ? Object.keys(factionContext).length : 0,
		})

		return context
	} catch (error) {
		logger.error("Error gathering quest creation context:", error)
		throw new Error("Failed to gather quest creation context")
	}
}

async function generateQuestConnectionSuggestions(
	args: z.infer<typeof enhancedQuestCreationSchema>,
	existingQuests: any[],
	activeConflicts: any[],
	availableFactions: any[],
) {
	const suggestions: string[] = []

	// Suggest based on quest type patterns
	if (args.type_hint) {
		const relatedQuests = existingQuests.filter(
			(q) =>
				q.questType === args.type_hint ||
				(args.type_hint === "main" && q.questType === "story") ||
				(args.type_hint === "faction" && q.questType === "political"),
		)

		if (relatedQuests.length > 0) {
			suggestions.push(`Continuation of ${relatedQuests[0].name} storyline`)
			if (relatedQuests.length > 1) {
				suggestions.push(`Parallel quest to ${relatedQuests[1].name} events`)
			}
		}
	}

	// Suggest conflict integration
	if (activeConflicts.length > 0) {
		const highPriorityConflicts = activeConflicts.filter((c) => c.priority === "high")
		if (highPriorityConflicts.length > 0) {
			suggestions.push(`Direct involvement in ${highPriorityConflicts[0].name} conflict`)
		} else {
			suggestions.push(`Side effects of ${activeConflicts[0].name} situation`)
		}
	}

	// Suggest faction involvement
	if (args.faction_hint && availableFactions.length > 0) {
		const matchingFactions = availableFactions.filter((f) =>
			f.name.toLowerCase().includes(args.faction_hint?.toLowerCase() || ""),
		)

		if (matchingFactions.length > 0) {
			suggestions.push(`${matchingFactions[0].name} commission or internal matter`)
		}
	}

	// Suggest theme-based connections
	if (args.theme_hint) {
		const themeConnections = {
			investigation: "Mystery requiring careful inquiry and evidence gathering",
			combat: "Direct confrontation with hostile forces",
			diplomacy: "Negotiation and relationship building between parties",
			rescue: "Time-sensitive mission to save someone or something",
			exploration: "Discovery of new locations or ancient secrets",
			heist: "Stealth mission to acquire something valuable",
		}

		const suggestion = themeConnections[args.theme_hint as keyof typeof themeConnections]
		if (suggestion) {
			suggestions.push(suggestion)
		}
	}

	return suggestions
}

async function enhancedQuestCreationHandler(args: unknown) {
	const parseResult = enhancedQuestCreationSchema.safeParse(args)
	if (!parseResult.success) {
		return {
			messages: [
				{
					role: "user" as const,
					content: {
						type: "text" as const,
						text: `❌ Invalid arguments: ${parseResult.error.message}`,
					},
				},
			],
		}
	}

	const validatedArgs = parseResult.data
	logger.info("Executing enhanced quest creation prompt", validatedArgs)

	const context = await gatherQuestCreationContext(validatedArgs)

	return {
		messages: [
			{
				role: "user" as const,
				content: {
					type: "resource" as const,
					resource: {
						uri: `campaign://creation-context/quest-${validatedArgs.name}`,
						text: JSON.stringify(context, null, 2),
						mimeType: "application/json",
					},
				},
			},
			{
				role: "user" as const,
				content: {
					type: "text" as const,
					text: `Create Quest: "${validatedArgs.name}"

Type hint: ${validatedArgs.type_hint || "No preference"}
Level hint: ${validatedArgs.level_hint || "No preference"}
Location hint: ${validatedArgs.location_hint || "No preference"}
Faction hint: ${validatedArgs.faction_hint || "No preference"}
Theme hint: ${validatedArgs.theme_hint || "No preference"}

Generate a complete quest including:
- Clear quest objectives and success conditions
- Quest giver and their motivation (reference existing NPCs and factions)
- Detailed quest stages with specific locations and challenges
- Primary location(s) and how they're used (use existing locations)
- Key NPCs involved (allies, enemies, neutrals) with their roles
- Faction relationships and political implications
- Integration with active conflicts and ongoing campaign events
- Potential complications and alternative solutions
- Rewards (treasure, information, political gains, relationships)
- Connections to existing quests (sequels, parallels, or prerequisites)
- Secrets or hidden elements that enhance the narrative
- Hooks for future adventures and story development

Ensure the quest fits naturally into the current campaign state and creates meaningful consequences for the world. Consider how completing or failing this quest would affect relationships, conflicts, and future story opportunities.`,
				},
			},
		],
	}
}

export const enhancedQuestPromptDefinitions: Record<string, PromptDefinition> = {
	"create-quest-enhanced": {
		description: "Create a quest with full campaign context, NPC integration, and narrative consequences",
		schema: enhancedQuestCreationSchema,
		handler: enhancedQuestCreationHandler,
	},
}

// Export the context gathering function for use in other files
export { gatherQuestCreationContext }
