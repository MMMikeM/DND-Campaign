import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { itemConnections, items } from "./tables"

export const itemSearchDataView = pgView("item_search_data_view").as((qb) =>
	qb
		.select({
			id: items.id,
			sourceTable: sql<string>`'items'`.as("source_table"),
			entityMain: sql<string>`to_jsonb(${items})`.as("entity_main"),
			questStage:
				sql<string>`COALESCE(jsonb_build_object('stage', jsonb_build_object('id', ${questStages.id}, 'name', ${questStages.name}), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb)`.as(
					"questStage",
				),
			quest: sql<string>`COALESCE(jsonb_build_object('id', rq.id, 'name', rq.name), '{}'::jsonb)`.as("quest"),
			relations: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(${itemConnections}.*),
    'item', CASE WHEN ${itemConnections.connectedItemId} IS NOT NULL THEN jsonb_build_object('id', ti.id, 'name', ti.name) END,
    'npc', CASE WHEN ${itemConnections.connectedNpcId} IS NOT NULL THEN jsonb_build_object('id', tn.id, 'name', tn.name) END,
    'faction', CASE WHEN ${itemConnections.connectedFactionId} IS NOT NULL THEN jsonb_build_object('id', tf.id, 'name', tf.name) END,
    'site', CASE WHEN ${itemConnections.connectedSiteId} IS NOT NULL THEN jsonb_build_object('id', ts.id, 'name', ts.name) END,
    'quest', CASE WHEN ${itemConnections.connectedQuestId} IS NOT NULL THEN jsonb_build_object('id', tq.id, 'name', tq.name) END,
    'conflict', CASE WHEN ${itemConnections.connectedConflictId} IS NOT NULL THEN jsonb_build_object('id', tc.id, 'name', tc.name) END,
    'lore', CASE WHEN ${itemConnections.connectedLoreId} IS NOT NULL THEN jsonb_build_object('id', tl.id, 'name', tl.name) END
  )) FILTER (WHERE ${itemConnections.id} IS NOT NULL), '[]'::jsonb)`.as("relations"),
			incomingRelations: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb)`.as("incomingRelations"),
			notableHistory: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb(${itemConnections}.*),
    'keyNpc', CASE WHEN ${itemConnections.connectedNpcId} IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) END,
    'locationSite', CASE WHEN ${itemConnections.connectedSiteId} IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) END
  )) FILTER (WHERE ${itemConnections.id} IS NOT NULL), '[]'::jsonb)`.as("notableHistory"),
			incomingForeshadowing:
				sql<string>`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incomingForeshadowing",
				),
		})
		.from(items)
		.leftJoin(sql`${quests} AS sq`, sql`${questStages.questId} = sq.id`)
		.leftJoin(itemConnections, sql`${itemConnections.itemId} = ${items.id}`)
		.leftJoin(sql`${items} AS ti`, sql`${itemConnections.connectedItemId} = ti.id`)
		.leftJoin(sql`${npcs} AS tn`, sql`${itemConnections.connectedNpcId} = tn.id`)
		.leftJoin(sql`${factions} AS tf`, sql`${itemConnections.connectedFactionId} = tf.id`)
		.leftJoin(sql`${sites} AS ts`, sql`${itemConnections.connectedSiteId} = ts.id`)
		.leftJoin(sql`${quests} AS tq`, sql`${itemConnections.connectedQuestId} = tq.id`)
		.leftJoin(sql`${conflicts} AS tc`, sql`${itemConnections.connectedConflictId} = tc.id`)
		.leftJoin(sql`${lore} AS tl`, sql`${itemConnections.connectedLoreId} = tl.id`)
		.leftJoin(sql`${itemConnections} AS ir_in`, sql`ir_in.source_item_id = ${items.id}`)
		.leftJoin(sql`${items} AS si`, sql`ir_in.target_item_id = si.id`)
		.leftJoin(sql`${sites} AS hs`, sql`${itemConnections.connectedSiteId} = hs.id`)
		.leftJoin(foreshadowing, sql`${foreshadowing.targetItemId} = ${items.id}`)
		.groupBy(items.id, questStages.id, sql`sq.id`, sql`rq.id`),
)
