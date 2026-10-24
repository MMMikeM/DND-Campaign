// Re-export all entity logic, types, and shared utils

import { buildFullTextQuery, type FullTextHit } from "@tome-master/shared/db"
import type { EntityRef } from "@tome-master/shared/search"
import { db } from "../db"
export * from "./areas"
export * from "./conflicts"
export * from "./consequences"
export * from "./factions"
export * from "./foreshadowing"
export * from "./lore"
export * from "./maps"
export * from "./npcs"
export * from "./quests"
export * from "./regions"
export * from "./sites"

// export const updateMaterializedView = async () => await db.execute(sql`REFRESH MATERIALIZED VIEW search_index`)


export const fullTextSearch = async (searchTerm: string, limit = 10): Promise<EntityRef[]> => {
	const { rows } = await db.execute<FullTextHit>(buildFullTextQuery(searchTerm, limit))
	return rows.map(({ id, source_table, name, slug }) => ({ id, table: source_table, name, slug }))
}

export const nameAndId = { columns: { id: true, name: true, slug: true } } as const

export const bySlugOrId = (slugOrId: string): { id: number } | { slug: string } => {
	const id = Number(slugOrId)
	return Number.isInteger(id) && id > 0 ? { id } : { slug: slugOrId }
}

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

export const consequenceWithTrigger = {
	with: {
		triggerQuest: nameAndId,
		triggerQuestStageDecision: nameAndId,
	},
} as const

export const consequenceWithAffected = {
	with: {
		affectedArea: nameAndId,
		affectedConflict: nameAndId,
		affectedConsequence: nameAndId,
		affectedFaction: nameAndId,
		affectedNpc: nameAndId,
		affectedQuest: nameAndId,
		affectedRegion: nameAndId,
		affectedSite: nameAndId,
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
