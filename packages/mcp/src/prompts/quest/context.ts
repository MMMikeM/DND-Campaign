/**
 * Quest Context Gathering
 *
 * Functions for gathering comprehensive campaign context for quest creation
 * including existing entities, conflicts, and relationship analysis.
 */

import { tables } from "@tome-master/shared"
import { eq, inArray } from "drizzle-orm"
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
	conflictTables: { conflicts },
	factionTables: { factions },
	npcTables: { npcFactions },
	questTables: { quests },
} = tables

// Helper functions for database queries
async function findQuestsByIds(questIds: number[]) {
	if (questIds.length === 0) return []

	const results = await db.query.quests.findMany({
		where: inArray(quests.id, questIds),
		columns: { id: true, name: true, type: true },
	})
	return results.map((quest) => ({
		...quest,
		id: String(quest.id),
		type: Array.isArray(quest.type) ? quest.type.join(", ") : quest.type,
	}))
}

async function findFactionsByIds(factionIds: number[]) {
	if (factionIds.length === 0) return []

	const results = await db.query.factions.findMany({
		where: inArray(factions.id, factionIds),
		columns: {
			id: true,
			name: true,
			type: true,
			publicAlignment: true,
			secretAlignment: true,
			description: true,
		},
	})
	return results.map((faction) => ({
		...faction,
		id: String(faction.id),
		type: Array.isArray(faction.type) ? faction.type.join(", ") : faction.type,
		description: Array.isArray(faction.description) ? faction.description.join(", ") : (faction.description as string),
		secretAlignment: faction.secretAlignment || "None",
	}))
}

const findQuestConflicts = async (name: string) =>
	(await searchBySimilarity(name)).rows.filter((row) => row.source_table === "quests").map(({ id }) => id as number)

const findFactionMatches = async (factionHint: string) =>
	(await searchBySimilarity(factionHint)).rows
		.filter((row) => row.source_table === "factions")
		.map(({ id }) => id as number)

/**
 * Gathers comprehensive context for quest creation including existing entities,
 * conflicts, and suggested connections
 */
export async function gatherQuestCreationContext(args: QuestCreationArgs): Promise<QuestContext> {
	logger.info("Gathering quest creation context", args)

	try {
		// Check for name conflicts using fuzzy search
		const questConflictIds = await findQuestConflicts(args.name)
		const nameConflicts = await findQuestsByIds(questConflictIds)

		// Fetch all required data in parallel for better performance
		const [existingQuests, recentQuestStages, availableLocations, availableFactions, availableNPCs, activeConflicts] =
			await Promise.all([
				// Get existing quests for continuity and connections
				db.query.quests
					.findMany({
						columns: {
							id: true,
							name: true,
							type: true,
							description: true,
						},
					})
					.then((res) =>
						res.map((q) => ({
							...q,
							id: String(q.id),
							description: Array.isArray(q.description) ? q.description.join("\\n") : (q.description as string),
						})),
					),

				// Get quest stages for structure inspiration
				db.query.questStages
					.findMany({
						columns: {
							id: true,
							questId: true,
							name: true,
							description: true,
						},
					})
					.then((res) =>
						res.map((qs) => ({
							...qs,
							id: String(qs.id),
							questId: String(qs.questId),
							description: Array.isArray(qs.description) ? qs.description.join("\\n") : (qs.description as string),
						})),
					),

				// Get locations for quest settings
				db.query.sites
					.findMany({
						columns: {
							id: true,
							name: true,
							type: true,
							description: true,
						},
					})
					.then((res) =>
						res.map((s) => ({
							...s,
							id: String(s.id),
							description: Array.isArray(s.description) ? s.description.join("\\n") : (s.description as string),
						})),
					),

				// Get factions for quest givers and opposition
				db.query.factions
					.findMany({
						columns: {
							id: true,
							name: true,
							type: true,
							publicAlignment: true,
							secretAlignment: true,
							description: true,
						},
					})
					.then((res) =>
						res.map((f) => ({
							...f,
							id: String(f.id),
							type: Array.isArray(f.type) ? f.type.join(", ") : (f.type as string),
							description: Array.isArray(f.description) ? f.description.join("\\n") : (f.description as string),
							secretAlignment: f.secretAlignment || "None",
						})),
					),

				// Get NPCs for quest givers, targets, and allies
				db.query.npcs
					.findMany({
						columns: {
							id: true,
							name: true,
							occupation: true,
							alignment: true,
						},
					})
					.then((res) => res.map((n) => ({ ...n, id: String(n.id) }))),

				// Get active conflicts for quest integration
				db.query.conflicts
					.findMany({
						where: eq(conflicts.status, "active"),
						columns: {
							id: true,
							name: true,
							natures: true,
							description: true,
						},
						limit: 8,
					})
					.then((res) =>
						res.map((c) => ({
							...c,
							id: String(c.id),
							description: Array.isArray(c.description) ? c.description.join("\\n") : (c.description as string),
						})),
					),
			])

		// Get faction-specific entities if faction hint provided
		const factionContext = await gatherFactionContext(args.faction_hint)

		const mappedFactionsForSuggestions = availableFactions.map((f) => ({ name: f.name, type: f.type }))

		// Generate quest connection suggestions and analysis
		const [
			suggestedConnections,
			questTypeAnalysis,
			themeAnalysis,
			rewardSuggestions,
			complicationSuggestions,
			futureHookSuggestions,
		] = await Promise.all([
			generateQuestConnectionSuggestions(args, existingQuests, activeConflicts, mappedFactionsForSuggestions),
			Promise.resolve(analyzeQuestTypePatterns(args.type_hint, existingQuests)),
			Promise.resolve(analyzeThemeCompatibility(args.theme_hint, activeConflicts, mappedFactionsForSuggestions)),
			Promise.resolve(suggestQuestRewards(args.type_hint, factionContext, activeConflicts)),
			Promise.resolve(suggestQuestComplications(args, activeConflicts, mappedFactionsForSuggestions)),
			Promise.resolve(suggestFutureHooks(args, existingQuests, mappedFactionsForSuggestions)),
		])

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
		logger.error("Error gathering quest creation context:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			questArgs: args,
		})
		throw new Error(
			`Failed to gather quest creation context for "${args.name}": ${error instanceof Error ? error.message : String(error)}`,
		)
	}
}

/**
 * Gathers faction-specific context when a faction hint is provided
 */
async function gatherFactionContext(factionHint?: string) {
	if (!factionHint) return null

	try {
		// Use fuzzy search to find factions
		const factionIds = await findFactionMatches(factionHint)
		if (factionIds.length === 0) return null

		const relatedFactions = await findFactionsByIds(factionIds)
		if (relatedFactions.length === 0) return null

		// Get NPCs in the faction via junction table
		const factionNPCRelations = await db.query.npcFactions.findMany({
			where: inArray(npcFactions.factionId, factionIds),
			with: {
				npc: {
					columns: { id: true, name: true, occupation: true, alignment: true },
				},
			},
			limit: 8,
		})

		const factionNPCs = factionNPCRelations.map((rel) => ({ ...rel.npc, id: String(rel.npc.id) }))

		return {
			factions: relatedFactions,
			members: factionNPCs,
		}
	} catch (error) {
		logger.error("Error gathering faction context:", {
			error:
				error instanceof Error
					? {
							name: error.name,
							message: error.message,
							stack: error.stack,
						}
					: error,
			factionHint,
		})
		return null
	}
}
