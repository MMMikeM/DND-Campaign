import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { entityJson, jsonAgg, jsonObject, optionalEntityJson } from "../view-utils"
import { itemConnections, items } from "./tables"

// items appears as the subject, an outgoing connection's target and an incoming
// connection's source; item_connections appears in both directions.
const connectedItem = alias(items, "connected_item")
const incomingConnections = alias(itemConnections, "incoming_connections")
const incomingSourceItem = alias(items, "incoming_source_item")

const connectionTargets = [
	optionalEntityJson("item", itemConnections.connectedItemId, connectedItem),
	optionalEntityJson("npc", itemConnections.connectedNpcId, npcs),
	optionalEntityJson("faction", itemConnections.connectedFactionId, factions),
	optionalEntityJson("site", itemConnections.connectedSiteId, sites),
	optionalEntityJson("quest", itemConnections.connectedQuestId, quests),
	optionalEntityJson("conflict", itemConnections.connectedConflictId, conflicts),
	optionalEntityJson("lore", itemConnections.connectedLoreId, lore),
	optionalEntityJson("questStage", itemConnections.connectedQuestStageId, questStages),
]

export const itemSearchDataView = pgView("item_search_data_view").as((qb) =>
	qb
		.select({
			id: items.id,
			sourceTable: sql<string>`'items'`.as("source_table"),
			entityMain: sql`to_jsonb(${items}.*)`.as("entity_main"),
			relations: jsonAgg(
				jsonObject([sql`'relationship', to_jsonb(${itemConnections}.*)`, ...connectionTargets]),
				itemConnections.id,
			).as("relations"),
			incomingRelations: jsonAgg(
				jsonObject([
					sql`'relationship', to_jsonb(${incomingConnections}.*)`,
					sql`'sourceItem', ${entityJson(incomingSourceItem)}`,
				]),
				incomingConnections.id,
			).as("incoming_relations"),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${foreshadowing}.*)`, foreshadowing.id).as("incoming_foreshadowing"),
		})
		.from(items)
		.leftJoin(itemConnections, eq(itemConnections.itemId, items.id))
		.leftJoin(connectedItem, eq(itemConnections.connectedItemId, connectedItem.id))
		.leftJoin(npcs, eq(itemConnections.connectedNpcId, npcs.id))
		.leftJoin(factions, eq(itemConnections.connectedFactionId, factions.id))
		.leftJoin(sites, eq(itemConnections.connectedSiteId, sites.id))
		.leftJoin(quests, eq(itemConnections.connectedQuestId, quests.id))
		.leftJoin(conflicts, eq(itemConnections.connectedConflictId, conflicts.id))
		.leftJoin(lore, eq(itemConnections.connectedLoreId, lore.id))
		.leftJoin(questStages, eq(itemConnections.connectedQuestStageId, questStages.id))
		.leftJoin(incomingConnections, eq(incomingConnections.connectedItemId, items.id))
		.leftJoin(incomingSourceItem, eq(incomingConnections.itemId, incomingSourceItem.id))
		.leftJoin(foreshadowing, eq(foreshadowing.targetItemId, items.id))
		.groupBy(items.id),
)
