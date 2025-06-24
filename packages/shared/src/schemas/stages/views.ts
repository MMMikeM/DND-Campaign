import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { foreshadowing } from "../foreshadowing/tables"
import { items } from "../items/tables"
import { consequences, narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { npcStageInvolvement, questStageDecisions, questStages } from "./tables"

export const questStageSearchDataView = pgView("quest_stage_search_data_view").as((qb) =>
	qb
		.select({
			id: questStages.id,
			sourceTable: sql<string>`'quest_stages'`.as("source_table"),
			entityMain: sql`to_jsonb(${questStages}.*)`.as("entity_main"),
			quest: sql`COALESCE(jsonb_build_object('id', ${quests.id}, 'name', ${quests.name}), '{}'::jsonb)`.as("quest"),
			site: sql`COALESCE(jsonb_build_object('id', ${sites.id}, 'name', ${sites.name}), '{}'::jsonb)`.as("site"),
			deliveryNpc: sql`COALESCE(jsonb_build_object('id', ${npcs.id}, 'name', ${npcs.name}), '{}'::jsonb)`.as(
				"delivery_npc",
			),
			outgoingDecisions:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_out.*), 'toStage', jsonb_build_object('id', ts_out.id, 'name', ts_out.name))) FILTER (WHERE qsd_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_decisions",
				),
			incomingDecisions:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('decision', to_jsonb(qsd_in.*), 'fromStage', jsonb_build_object('id', ts_in.id, 'name', ts_in.name))) FILTER (WHERE qsd_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_decisions",
				),
			items:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${items.id}, 'name', ${items.name})) FILTER (WHERE ${items.id} IS NOT NULL), '[]'::jsonb)`.as(
					"items",
				),
			narrativeEvents:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${narrativeEvents.id}, 'description', ${narrativeEvents.description})) FILTER (WHERE ${narrativeEvents.id} IS NOT NULL), '[]'::jsonb)`.as(
					"narrative_events",
				),
			npcInvolvement:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(${npcStageInvolvement}.*), 'npc', jsonb_build_object('id', inv_npc.id, 'name', inv_npc.name))) FILTER (WHERE ${npcStageInvolvement.id} IS NOT NULL), '[]'::jsonb)`.as(
					"npc_involvement",
				),
			outgoingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_foreshadowing",
				),
		})
		.from(questStages)
		.leftJoin(quests, sql`${questStages.questId} = ${quests.id}`)
		.leftJoin(sites, sql`${questStages.siteId} = ${sites.id}`)
		.leftJoin(npcs, sql`${questStages.deliveryNpcId} = ${npcs.id}`)
		.leftJoin(sql`${questStageDecisions} AS qsd_out`, sql`qsd_out.from_quest_stage_id = ${questStages.id}`)
		.leftJoin(sql`${questStages} AS ts_out`, sql`qsd_out.to_quest_stage_id = ts_out.id`)
		.leftJoin(sql`${questStageDecisions} AS qsd_in`, sql`qsd_in.to_quest_stage_id = ${questStages.id}`)
		.leftJoin(sql`${questStages} AS ts_in`, sql`qsd_in.from_quest_stage_id = ts_in.id`)
		.leftJoin(items, sql`${items.questStageId} = ${questStages.id}`)
		.leftJoin(narrativeEvents, sql`${narrativeEvents.questStageId} = ${questStages.id}`)
		.leftJoin(npcStageInvolvement, sql`${npcStageInvolvement.questStageId} = ${questStages.id}`)
		.leftJoin(sql`${npcs} AS inv_npc`, sql`${npcStageInvolvement.npcId} = inv_npc.id`)
		.leftJoin(foreshadowing, sql`${foreshadowing.sourceQuestStageId} = ${questStages.id}`)
		.groupBy(questStages.id, quests.id, sites.id, npcs.id),
)

export const questStageDecisionSearchDataView = pgView("quest_stage_decision_search_data_view").as((qb) =>
	qb
		.select({
			id: questStageDecisions.id,
			sourceTable: sql<string>`'quest_stage_decisions'`.as("source_table"),
			entityMain: sql`to_jsonb(${questStageDecisions}.*)`.as("entity_main"),
			quest: sql`COALESCE(jsonb_build_object('id', ${quests.id}, 'name', ${quests.name}), '{}'::jsonb)`.as("quest"),
			fromStage: sql`COALESCE(jsonb_build_object('id', fs.id, 'name', fs.name), '{}'::jsonb)`.as("from_stage"),
			toStage: sql`COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb)`.as("to_stage"),
			triggeredEvents:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${narrativeEvents.id}, 'description', ${narrativeEvents.description})) FILTER (WHERE ${narrativeEvents.id} IS NOT NULL), '[]'::jsonb)`.as(
					"triggered_events",
				),
			consequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${consequences.id}, 'description', ${consequences.description})) FILTER (WHERE ${consequences.id} IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
		})
		.from(questStageDecisions)
		.leftJoin(quests, sql`${questStageDecisions.questId} = ${quests.id}`)
		.leftJoin(sql`${questStages} AS fs`, sql`${questStageDecisions.fromQuestStageId} = fs.id`)
		.leftJoin(sql`${questStages} AS ts`, sql`${questStageDecisions.toQuestStageId} = ts.id`)
		.leftJoin(narrativeEvents, sql`${narrativeEvents.triggeringStageDecisionId} = ${questStageDecisions.id}`)
		.leftJoin(consequences, sql`${consequences.triggerQuestStageDecisionId} = ${questStageDecisions.id}`)
		.groupBy(questStageDecisions.id, quests.id, sql`fs.id`, sql`ts.id`),
)
