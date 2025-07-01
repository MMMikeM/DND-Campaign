// items/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { itemTypes, narrativeRoles, rarityLevels } = enums

export const items = pgTable("items", {
	id: pk(),
	name: string("name").unique(),
	description: list("description"),
	tags: list("tags"),
	creativePrompts: list("creative_prompts"),

	itemType: oneOf("item_type", itemTypes),
	rarity: oneOf("rarity", rarityLevels),
	narrativeRole: oneOf("narrative_role", narrativeRoles),

	narrativeSignificance: string("narrative_significance"),
	provenanceAndHistory: list("provenance_and_history"),
	mechanicalEffects: list("mechanical_effects"),
})

export const itemConnections = pgTable(
	"item_connections",
	{
		id: pk(),

		itemId: cascadeFk("source_item_id", items.id),

		relationship: string("relationship"),
		details: list("details"),

		connectedNpcId: nullableFk("connected_npc_id", npcs.id),
		connectedFactionId: nullableFk("connected_faction_id", factions.id),
		connectedSiteId: nullableFk("connected_site_id", sites.id),
		connectedQuestId: nullableFk("connected_quest_id", quests.id),
		connectedConflictId: nullableFk("connected_conflict_id", conflicts.id),
		connectedLoreId: nullableFk("connected_lore_id", () => lore.id),
		connectedItemId: nullableFk("connected_item_id", () => items.id),
		connectedQuestStageId: nullableFk("connected_quest_stage_id", questStages.id),
	},
	(table) => [
		unique().on(
			table.itemId,
			table.connectedNpcId,
			table.connectedFactionId,
			table.connectedSiteId,
			table.connectedQuestId,
			table.connectedConflictId,
			table.connectedLoreId,
			table.connectedItemId,
			table.connectedQuestStageId,
		),
		check(
			"chk_single_connected_fk",
			sql`(
					(CASE WHEN ${table.connectedNpcId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedFactionId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedSiteId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedQuestId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedConflictId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedLoreId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedItemId} IS NOT NULL THEN 1 ELSE 0 END) +
					(CASE WHEN ${table.connectedQuestStageId} IS NOT NULL THEN 1 ELSE 0 END)
			) = 1`,
		),
	],
)
