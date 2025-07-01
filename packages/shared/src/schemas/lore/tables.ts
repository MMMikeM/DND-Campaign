// lore/tables.ts

import { sql } from "drizzle-orm"
import { check, pgTable, text, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../db/utils"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { items } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { loreTypes, linkStrengths } = enums

export const lore = pgTable("lore", {
	id: pk(),
	name: string("name").unique(),
	description: text("description").array(),
	creativePrompts: list("creative_prompts"),
	tags: list("tags"),

	summary: string("summary"),
	surfaceImpression: string("surface_impression"),
	livedReality: string("lived_reality"),
	hiddenTruths: string("hidden_truths"),
	modernRelevance: string("modern_relevance"),

	loreType: oneOf("lore_type", loreTypes),

	aestheticsAndSymbols: list("aesthetics_and_symbols"),
	interactionsAndRules: list("interactions_and_rules"),
	connectionsToWorld: list("connections_to_world"),
	coreTenetsAndTraditions: list("core_tenets_and_traditions"),
	historyAndLegacy: list("history_and_legacy"),
	conflictingNarratives: list("conflicting_narratives"),
})

export const loreLinks = pgTable(
	"lore_links",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		tags: list("tags"),

		loreId: cascadeFk("lore_id", lore.id),

		linkStrength: oneOf("link_strength", linkStrengths),
		regionId: nullableFk("region_id", regions.id),
		factionId: nullableFk("faction_id", factions.id),
		npcId: nullableFk("npc_id", npcs.id),
		conflictId: nullableFk("conflict_id", conflicts.id),
		questId: nullableFk("quest_id", quests.id),
		foreshadowingId: nullableFk("foreshadowing_id", () => foreshadowing.id),
		relatedLoreId: nullableFk("related_lore_id", lore.id),
		itemId: nullableFk("item_id", () => items.id),
		linkRoleOrTypeText: string("link_role_or_type_text"),
		linkDetailsText: string("link_details_text"),
	},
	(table) => [
		unique("unique_lore_link").on(
			table.loreId,
			table.regionId,
			table.factionId,
			table.npcId,
			table.conflictId,
			table.questId,
			table.foreshadowingId,
			table.relatedLoreId,
			table.itemId,
		),
		check(
			"single_fk_check",
			sql`(
        (case when ${table.regionId} is not null then 1 else 0 end) +
        (case when ${table.factionId} is not null then 1 else 0 end) +
        (case when ${table.npcId} is not null then 1 else 0 end) +
        (case when ${table.conflictId} is not null then 1 else 0 end) +
        (case when ${table.questId} is not null then 1 else 0 end) +
        (case when ${table.foreshadowingId} is not null then 1 else 0 end) +
        (case when ${table.relatedLoreId} is not null then 1 else 0 end) +
        (case when ${table.itemId} is not null then 1 else 0 end)
      ) = 1`,
		),
	],
)
