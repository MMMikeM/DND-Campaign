import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflictParticipants, conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { questHooks, quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { npcStageInvolvement, questStages } from "../stages/tables"
import { npcFactionMemberships, npcs } from "./tables"

export const npcSearchDataView = pgView("npc_search_data_view").as((qb) =>
	qb
		.select({
			id: npcs.id,
			sourceTable: sql<string>`'npcs'`.as("source_table"),
			entityMain: sql`to_jsonb(${npcs}.*)`.as("entity_main"),
			factionMemberships:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(${npcFactionMemberships}.*), 'faction', jsonb_build_object('id', ${factions.id}, 'name', ${factions.name}))) FILTER (WHERE ${npcFactionMemberships.id} IS NOT NULL), '[]'::jsonb)`.as(
					"faction_memberships",
				),
			conflictParticipation:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(${conflictParticipants}.*), 'conflict', jsonb_build_object('id', ${conflicts.id}, 'name', ${conflicts.name}))) FILTER (WHERE ${conflictParticipants.id} IS NOT NULL), '[]'::jsonb)`.as(
					"conflict_participation",
				),
			affectedByConsequences:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${consequences.id}, 'description', ${consequences.description})) FILTER (WHERE ${consequences.id} IS NOT NULL), '[]'::jsonb)`.as(
					"affected_by_consequences",
				),
			outgoingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_foreshadowing",
				),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_in.*)) FILTER (WHERE fs_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
			itemConnections:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemConnections}.*)) FILTER (WHERE ${itemConnections.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_connections",
				),
			questHooks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${questHooks.id}, 'source', ${questHooks.source}, 'hook_content', ${questHooks.hookContent}, 'quest', jsonb_build_object('id', qh_quest.id, 'name', qh_quest.name))) FILTER (WHERE ${questHooks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"quest_hooks",
				),
			questStageDeliveries:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs_delivery.id, 'name', qs_delivery.name, 'quest', jsonb_build_object('id', q_stage_delivery.id, 'name', q_stage_delivery.name))) FILTER (WHERE qs_delivery.id IS NOT NULL), '[]'::jsonb)`.as(
					"quest_stage_deliveries",
				),
			stageInvolvement:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(${npcStageInvolvement}.*), 'stage', jsonb_build_object('id', si.id, 'name', si.name), 'quest', jsonb_build_object('id', q_involvement.id, 'name', q_involvement.name))) FILTER (WHERE ${npcStageInvolvement.id} IS NOT NULL), '[]'::jsonb)`.as(
					"stage_involvement",
				),
			loreLinks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"lore_links",
				),
			outgoingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_out.*), 'relatedNpc', jsonb_build_object('id', rn_out.id, 'name', rn_out.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_relations",
				),
			incomingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn_in.id, 'name', sn_in.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_relations",
				),
		})
		.from(npcs)
		.leftJoin(npcFactionMemberships, sql`${npcFactionMemberships.npcId} = ${npcs.id}`)
		.leftJoin(factions, sql`${npcFactionMemberships.factionId} = ${factions.id}`)
		.leftJoin(areas, sql`${sites.areaId} = ${areas.id}`)
		.leftJoin(regions, sql`${areas.regionId} = ${regions.id}`)
		.leftJoin(conflictParticipants, sql`${conflictParticipants.npcId} = ${npcs.id}`)
		.leftJoin(conflicts, sql`${conflictParticipants.conflictId} = ${conflicts.id}`)
		.leftJoin(consequences, sql`${consequences.affectedNpcId} = ${npcs.id}`)
		.leftJoin(sql`${foreshadowing} AS fs_out`, sql`fs_out.source_npc_id = ${npcs.id}`)
		.leftJoin(sql`${foreshadowing} AS fs_in`, sql`fs_in.target_npc_id = ${npcs.id}`)
		.leftJoin(itemConnections, sql`${itemConnections.connectedNpcId} = ${npcs.id}`)
		.leftJoin(questHooks, sql`${questHooks.deliveryNpcId} = ${npcs.id}`)
		.leftJoin(sql`${quests} AS qh_quest`, sql`${questHooks.questId} = qh_quest.id`)
		.leftJoin(sql`${questStages} AS qs_delivery`, sql`qs_delivery.delivery_npc_id = ${npcs.id}`)
		.leftJoin(sql`${quests} AS q_stage_delivery`, sql`qs_delivery.quest_id = q_stage_delivery.id`)
		.leftJoin(npcStageInvolvement, sql`${npcStageInvolvement.npcId} = ${npcs.id}`)
		.leftJoin(sql`${questStages} AS si`, sql`${npcStageInvolvement.questStageId} = si.id`)
		.leftJoin(sql`${quests} AS q_involvement`, sql`si.quest_id = q_involvement.id`)
		.leftJoin(loreLinks, sql`${loreLinks.npcId} = ${npcs.id}`)
		.leftJoin(sql`${npcs} AS rn_out`, sql`${loreLinks.relatedLoreId} = rn_out.id`)
		.leftJoin(sql`${npcs} AS sn_in`, sql`${loreLinks.npcId} = sn_in.id`)
		.groupBy(npcs.id),
)
