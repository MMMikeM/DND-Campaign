import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { lore } from "../lore/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { itemNotableHistory, itemRelations, items } from "./tables"

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
    'relationship', to_jsonb(${itemRelations}.*),
    'targetItem', CASE WHEN ${itemRelations.targetEntityType} = 'item' THEN jsonb_build_object('id', ti.id, 'name', ti.name) END,
    'targetNpc', CASE WHEN ${itemRelations.targetEntityType} = 'npc' THEN jsonb_build_object('id', tn.id, 'name', tn.name) END,
    'targetFaction', CASE WHEN ${itemRelations.targetEntityType} = 'faction' THEN jsonb_build_object('id', tf.id, 'name', tf.name) END,
    'targetSite', CASE WHEN ${itemRelations.targetEntityType} = 'site' THEN jsonb_build_object('id', ts.id, 'name', ts.name) END,
    'targetQuest', CASE WHEN ${itemRelations.targetEntityType} = 'quest' THEN jsonb_build_object('id', tq.id, 'name', tq.name) END,
    'targetConflict', CASE WHEN ${itemRelations.targetEntityType} = 'conflict' THEN jsonb_build_object('id', tc.id, 'name', tc.name) END,
    'targetNarrativeDestination', CASE WHEN ${itemRelations.targetEntityType} = 'narrative_destination' THEN jsonb_build_object('id', tnd.id, 'name', tnd.name) END,
    'targetLore', CASE WHEN ${itemRelations.targetEntityType} = 'lore' THEN jsonb_build_object('id', tl.id, 'name', tl.name) END
  )) FILTER (WHERE ${itemRelations.id} IS NOT NULL), '[]'::jsonb)`.as("relations"),
			incomingRelations: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'relationship', to_jsonb(ir_in.*),
    'sourceItem', jsonb_build_object('id', si.id, 'name', si.name)
  )) FILTER (WHERE ir_in.id IS NOT NULL), '[]'::jsonb)`.as("incomingRelations"),
			notableHistory: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'history', to_jsonb(${itemNotableHistory}.*),
    'keyNpc', CASE WHEN ${itemNotableHistory.keyNpcId} IS NOT NULL THEN jsonb_build_object('id', hn.id, 'name', hn.name) END,
    'locationSite', CASE WHEN ${itemNotableHistory.locationSiteId} IS NOT NULL THEN jsonb_build_object('id', hs.id, 'name', hs.name) END
  )) FILTER (WHERE ${itemNotableHistory.id} IS NOT NULL), '[]'::jsonb)`.as("notableHistory"),
			incomingForeshadowing:
				sql<string>`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incomingForeshadowing",
				),
		})
		.from(items)
		.leftJoin(questStages, sql`${items.questStageId} = ${questStages.id}`)
		.leftJoin(sql`${quests} AS sq`, sql`${questStages.questId} = sq.id`)
		.leftJoin(sql`${quests} AS rq`, sql`${items.questId} = rq.id`)
		.leftJoin(itemRelations, sql`${itemRelations.sourceItemId} = ${items.id}`)
		.leftJoin(
			sql`${items} AS ti`,
			sql`${itemRelations.targetEntityType} = 'item' AND ${itemRelations.targetEntityId} = ti.id`,
		)
		.leftJoin(
			sql`${npcs} AS tn`,
			sql`${itemRelations.targetEntityType} = 'npc' AND ${itemRelations.targetEntityId} = tn.id`,
		)
		.leftJoin(
			sql`${factions} AS tf`,
			sql`${itemRelations.targetEntityType} = 'faction' AND ${itemRelations.targetEntityId} = tf.id`,
		)
		.leftJoin(
			sql`${sites} AS ts`,
			sql`${itemRelations.targetEntityType} = 'site' AND ${itemRelations.targetEntityId} = ts.id`,
		)
		.leftJoin(
			sql`${quests} AS tq`,
			sql`${itemRelations.targetEntityType} = 'quest' AND ${itemRelations.targetEntityId} = tq.id`,
		)
		.leftJoin(
			sql`${conflicts} AS tc`,
			sql`${itemRelations.targetEntityType} = 'conflict' AND ${itemRelations.targetEntityId} = tc.id`,
		)
		.leftJoin(
			sql`${narrativeDestinations} AS tnd`,
			sql`${itemRelations.targetEntityType} = 'narrative_destination' AND ${itemRelations.targetEntityId} = tnd.id`,
		)
		.leftJoin(
			sql`${lore} AS tl`,
			sql`${itemRelations.targetEntityType} = 'lore' AND ${itemRelations.targetEntityId} = tl.id`,
		)
		.leftJoin(
			sql`${itemRelations} AS ir_in`,
			sql`ir_in.target_entity_type = 'item' AND ir_in.target_entity_id = ${items.id}`,
		)
		.leftJoin(sql`${items} AS si`, sql`ir_in.source_item_id = si.id`)
		.leftJoin(itemNotableHistory, sql`${itemNotableHistory.itemId} = ${items.id}`)
		.leftJoin(sql`${npcs} AS hn`, sql`${itemNotableHistory.keyNpcId} = hn.id`)
		.leftJoin(sql`${sites} AS hs`, sql`${itemNotableHistory.locationSiteId} = hs.id`)
		.leftJoin(
			foreshadowing,
			sql`${foreshadowing.targetEntityType} = 'item' AND ${foreshadowing.targetEntityId} = ${items.id}`,
		)
		.groupBy(items.id, questStages.id, sql`sq.id`, sql`rq.id`),
)
