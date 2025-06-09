/**
 * Quest Context Gathering
 *
 * Functions for gathering comprehensive campaign context for quest creation
 * including existing entities, conflicts, and relationship analysis.
 */

import { tables } from "@tome-master/shared"
import { eq, or, sql } from "drizzle-orm"
import { db, logger } from "../.."
import { analyzeQuestTypePatterns, analyzeThemeCompatibility, searchBySimilarity } from "./analysis"
import {
	generateQuestConnectionSuggestions,
	suggestFutureHooks,
	suggestQuestComplications,
	suggestQuestRewards,
} from "./suggestions"
import type { QuestContext, QuestCreationArgs } from "./types"

const {
	conflictTables: { majorConflicts },
	factionTables: { factions },
	npcTables: { npcFactions },
	questTables: { quests },
} = tables

/**
 * Gathers comprehensive context for quest creation including existing entities,
 * conflicts, and suggested connections
 */
export async function gatherQuestCreationContext(args: QuestCreationArgs): Promise<QuestContext> {
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
		const factionContext = await gatherFactionContext(args.faction_hint)

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

		// Generate enhanced analysis and suggestions
		const questTypeAnalysis = analyzeQuestTypePatterns(args.type_hint, existingQuests)
		const themeAnalysis = analyzeThemeCompatibility(args.theme_hint, activeConflicts, availableFactions)
		const rewardSuggestions = suggestQuestRewards(args.type_hint, factionContext, activeConflicts)
		const complicationSuggestions = suggestQuestComplications(args, activeConflicts, availableFactions)
		const futureHookSuggestions = suggestFutureHooks(args, existingQuests, availableFactions)

		const context: QuestContext = {
			nameConflicts,
			existingQuests,
			recentQuestStages,
			availableLocations,
			availableFactions,
			availableNPCs,
			factionContext,
			activeConflicts,
			suggestedConnections,
			questTypeAnalysis,
			themeAnalysis,
			rewardSuggestions,
			complicationSuggestions,
			futureHookSuggestions,
		}

		logger.info("Quest context gathered successfully", {
			nameConflicts: nameConflicts.length,
			existingQuests: existingQuests.length,
			availableLocations: availableLocations.length,
			availableFactions: availableFactions.length,
			availableNPCs: availableNPCs.length,
			factionContext: factionContext ? Object.keys(factionContext).length : 0,
			questTypeAnalysis: questTypeAnalysis.length,
			themeAnalysis: themeAnalysis.length,
			rewardSuggestions: rewardSuggestions.length,
			complicationSuggestions: complicationSuggestions.length,
			futureHookSuggestions: futureHookSuggestions.length,
		})

		return context
	} catch (error) {
		logger.error("Error gathering quest creation context:", error)
		throw new Error("Failed to gather quest creation context")
	}
}

/**
 * Gathers faction-specific context when a faction hint is provided
 */
async function gatherFactionContext(factionHint?: string) {
	if (!factionHint) return null

	try {
		// Use fuzzy search to find factions
		const { rows: factionRows } = await searchBySimilarity(factionHint, 1.0, 0.3, 2, 2)
		const factionMatches = factionRows.filter((row) => row.source_table === "factions")

		if (factionMatches.length === 0) return null

		const relatedFactions = await db.query.factions.findMany({
			where: sql`${factions.id} IN (${sql.join(
				factionMatches.map((f) => f.id),
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

		if (relatedFactions.length === 0) return null

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

		return {
			factions: relatedFactions,
			members: factionNPCs,
		}
	} catch (error) {
		logger.error("Error gathering faction context:", error)
		return null
	}
}
