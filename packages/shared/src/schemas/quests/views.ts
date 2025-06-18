import { sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationQuestRoles, narrativeDestinations } from "../narrative-destinations/tables"
import { consequences, narrativeEvents } from "../narrative-events/tables"
import { npcs } from "../npcs/tables"
import { regions, sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { questHooks, questParticipants, questRelations, quests } from "./tables"

const c_trig = alias(consequences, "c_trig")
const c_aff = alias(consequences, "c_aff")

export const questSearchDataView = pgView("quest_search_data_view").as((qb) =>
	qb
		.select({
			id: quests.id,
			sourceTable: sql<string>`'quests'`.as("source_table"),
			entityMain: sql`to_jsonb(${quests}.*)`.as("entity_main"),
			region: sql`COALESCE(jsonb_build_object('id', ${regions.id}, 'name', ${regions.name}), '{}'::jsonb)`.as("region"),
			outgoingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_out.*), 'targetQuest', jsonb_build_object('id', tq.id, 'name', tq.name))) FILTER (WHERE qr_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_relations",
				),
			incomingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(qr_in.*), 'sourceQuest', jsonb_build_object('id', sq.id, 'name', sq.name))) FILTER (WHERE qr_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_relations",
				),
			stages:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${questStages.id}, 'name', ${questStages.name}, 'stage_order', ${questStages.stageOrder}, 'stage_type', ${questStages.stageType}, 'deliveryNpc', CASE WHEN ${questStages.deliveryNpcId} IS NOT NULL THEN jsonb_build_object('id', dn.id, 'name', dn.name) END)) FILTER (WHERE ${questStages.id} IS NOT NULL), '[]'::jsonb)`.as(
					"stages",
				),
			hooks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('hook', to_jsonb(${questHooks}.*), 'site', CASE WHEN ${questHooks.siteId} IS NOT NULL THEN jsonb_build_object('id', h_s.id, 'name', h_s.name) END, 'faction', CASE WHEN ${questHooks.factionId} IS NOT NULL THEN jsonb_build_object('id', h_f.id, 'name', h_f.name) END, 'deliveryNpc', CASE WHEN ${questHooks.deliveryNpcId} IS NOT NULL THEN jsonb_build_object('id', h_n.id, 'name', h_n.name) END)) FILTER (WHERE ${questHooks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"hooks",
				),
			participants:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(${questParticipants}.*), 'npc', CASE WHEN ${questParticipants.npcId} IS NOT NULL THEN jsonb_build_object('id', p_n.id, 'name', p_n.name) END, 'faction', CASE WHEN ${questParticipants.factionId} IS NOT NULL THEN jsonb_build_object('id', p_f.id, 'name', p_f.name) END)) FILTER (WHERE ${questParticipants.id} IS NOT NULL), '[]'::jsonb)`.as(
					"participants",
				),
			narrativeDestinationContributions:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb(${narrativeDestinationQuestRoles}.*), 'destination', jsonb_build_object('id', ${narrativeDestinations.id}, 'name', ${narrativeDestinations.name}))) FILTER (WHERE ${narrativeDestinationQuestRoles.id} IS NOT NULL), '[]'::jsonb)`.as(
					"narrative_destination_contributions",
				),
			triggeredConsequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${c_trig.id}, 'description', ${c_trig.description})) FILTER (WHERE ${c_trig.id} IS NOT NULL), '[]'::jsonb)`.as(
					"triggered_consequences",
				),
			affectingConsequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${c_aff.id}, 'description', ${c_aff.description})) FILTER (WHERE ${c_aff.id} IS NOT NULL), '[]'::jsonb)`.as(
					"affecting_consequences",
				),
			triggeredEvents:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${narrativeEvents.id}, 'description', ${narrativeEvents.description})) FILTER (WHERE ${narrativeEvents.id} IS NOT NULL), '[]'::jsonb)`.as(
					"triggered_events",
				),
			outgoingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_foreshadowing",
				),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
			itemRelations:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemRelations}.*)) FILTER (WHERE ${itemRelations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_relations",
				),
			loreLinks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"lore_links",
				),
		})
		.from(quests)
		.leftJoin(regions, sql`${quests.regionId} = ${regions.id}`)
		.leftJoin(sql`${questRelations} AS qr_out`, sql`qr_out.source_quest_id = ${quests.id}`)
		.leftJoin(sql`${quests} AS tq`, sql`qr_out.target_quest_id = tq.id`)
		.leftJoin(sql`${questRelations} AS qr_in`, sql`qr_in.target_quest_id = ${quests.id}`)
		.leftJoin(sql`${quests} AS sq`, sql`qr_in.source_quest_id = sq.id`)
		.leftJoin(questStages, sql`${questStages.questId} = ${quests.id}`)
		.leftJoin(sql`${npcs} AS dn`, sql`${questStages.deliveryNpcId} = dn.id`)
		.leftJoin(questHooks, sql`${questHooks.questId} = ${quests.id}`)
		.leftJoin(sql`${sites} AS h_s`, sql`${questHooks.siteId} = h_s.id`)
		.leftJoin(sql`${factions} AS h_f`, sql`${questHooks.factionId} = h_f.id`)
		.leftJoin(sql`${npcs} AS h_n`, sql`${questHooks.deliveryNpcId} = h_n.id`)
		.leftJoin(questParticipants, sql`${questParticipants.questId} = ${quests.id}`)
		.leftJoin(sql`${npcs} AS p_n`, sql`${questParticipants.npcId} = p_n.id`)
		.leftJoin(sql`${factions} AS p_f`, sql`${questParticipants.factionId} = p_f.id`)
		.leftJoin(narrativeDestinationQuestRoles, sql`${narrativeDestinationQuestRoles.questId} = ${quests.id}`)
		.leftJoin(
			narrativeDestinations,
			sql`${narrativeDestinationQuestRoles.narrativeDestinationId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(c_trig, sql`${c_trig.triggerEntityType} = 'quest' AND ${c_trig.triggerEntityId} = ${quests.id}`)
		.leftJoin(c_aff, sql`${c_aff.affectedEntityType} = 'quest' AND ${c_aff.affectedEntityId} = ${quests.id}`)
		.leftJoin(narrativeEvents, sql`${narrativeEvents.relatedQuestId} = ${quests.id}`)
		.leftJoin(
			sql`${foreshadowing} AS fs_out`,
			sql`fs_out.source_entity_type = 'quest' AND fs_out.source_entity_id = ${quests.id}`,
		)
		.leftJoin(
			sql`${foreshadowing} AS fs_in`,
			sql`fs_in.target_entity_type = 'quest' AND fs_in.target_entity_id = ${quests.id}`,
		)
		.leftJoin(
			itemRelations,
			sql`${itemRelations.targetEntityType} = 'quest' AND ${itemRelations.targetEntityId} = ${quests.id}`,
		)
		.leftJoin(loreLinks, sql`${loreLinks.targetEntityType} = 'quest' AND ${loreLinks.targetEntityId} = ${quests.id}`)
		.groupBy(quests.id, regions.id),
)
