import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { items } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { jsonAgg, jsonObject, optionalEntityJson } from "../view-utils"
import { lore, loreLinks } from "./tables"

// Only tables joined more than once need an alias: lore is both the subject and a
// link target, and foreshadowing appears three times.
const relatedLore = alias(lore, "related_lore")
const linkedForeshadowing = alias(foreshadowing, "linked_foreshadowing")
const outgoingForeshadowing = alias(foreshadowing, "outgoing_foreshadowing")

/** lore_links is a reified relationship: lore -> one of eight targets, carrying a payload. */
const linkTargets = [
	optionalEntityJson("region", loreLinks.regionId, regions),
	optionalEntityJson("faction", loreLinks.factionId, factions),
	optionalEntityJson("npc", loreLinks.npcId, npcs),
	optionalEntityJson("conflict", loreLinks.conflictId, conflicts),
	optionalEntityJson("quest", loreLinks.questId, quests),
	optionalEntityJson("item", loreLinks.itemId, items),
	optionalEntityJson("relatedLore", loreLinks.relatedLoreId, relatedLore),
	optionalEntityJson("foreshadowing", loreLinks.foreshadowingId, linkedForeshadowing),
]

export const loreSearchDataView = pgView("lore_search_data_view").as((qb) =>
	qb
		.select({
			id: lore.id,
			sourceTable: sql<string>`'lore'`.as("source_table"),
			entityMain: sql`to_jsonb(${lore}.*)`.as("entity_main"),
			links: jsonAgg(jsonObject([sql`'link', to_jsonb(${loreLinks}.*)`, ...linkTargets]), loreLinks.id).as("links"),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${foreshadowing}.*)`, foreshadowing.id).as("incoming_foreshadowing"),
			outgoingForeshadowing: jsonAgg(sql`to_jsonb(${outgoingForeshadowing}.*)`, outgoingForeshadowing.id).as(
				"outgoing_foreshadowing",
			),
		})
		.from(lore)
		.leftJoin(loreLinks, eq(loreLinks.loreId, lore.id))
		.leftJoin(regions, eq(loreLinks.regionId, regions.id))
		.leftJoin(factions, eq(loreLinks.factionId, factions.id))
		.leftJoin(npcs, eq(loreLinks.npcId, npcs.id))
		.leftJoin(conflicts, eq(loreLinks.conflictId, conflicts.id))
		.leftJoin(quests, eq(loreLinks.questId, quests.id))
		.leftJoin(items, eq(loreLinks.itemId, items.id))
		.leftJoin(relatedLore, eq(loreLinks.relatedLoreId, relatedLore.id))
		.leftJoin(linkedForeshadowing, eq(loreLinks.foreshadowingId, linkedForeshadowing.id))
		.leftJoin(outgoingForeshadowing, eq(outgoingForeshadowing.sourceLoreId, lore.id))
		.leftJoin(foreshadowing, eq(foreshadowing.targetLoreId, lore.id))
		.groupBy(lore.id),
)
