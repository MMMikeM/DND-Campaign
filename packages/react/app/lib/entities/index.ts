// Re-export all entity logic, types, and shared utils

import { sql } from "@tome-master/shared"
import { db } from "../db"

export * from "./areas"
export * from "./conflicts"
export * from "./consequences"
export * from "./factions"
export * from "./foreshadowing"
export * from "./lore"
export * from "./maps"
export * from "./npcs"
export * from "./questStages"
export * from "./quests"
export * from "./regions"
export * from "./sites"

export const updateMaterializedView = async () => await db.execute(sql`REFRESH MATERIALIZED VIEW search_index`)

export const searchBySimilarity = async (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 4,
) =>
	await db.execute(sql`
    SELECT * FROM search_fuzzy_combined(
      ${searchTerm},
      ${fuzzyWeight},
      ${similarityThreshold},
      ${maxLevenshtein},
      ${phoneticStrength}
    )
  `)

export const nameAndId = { columns: { id: true, name: true } } as const

export const foreshadowingWithTargets = {
	with: {
		targetArea: nameAndId,
		targetConflict: nameAndId,
		targetConsequence: nameAndId,
		targetFaction: nameAndId,
		targetItem: nameAndId,
		targetLore: nameAndId,
		targetNpc: nameAndId,
		targetQuest: nameAndId,
		targetRegion: nameAndId,
		targetSite: nameAndId,
	},
} as const

export const foreshadowingWithSources = {
	with: {
		sourceItem: nameAndId,
		sourceLore: nameAndId,
		sourceNpc: nameAndId,
		sourceQuest: nameAndId,
		sourceQuestStage: nameAndId,
		sourceSite: nameAndId,
	},
} as const
