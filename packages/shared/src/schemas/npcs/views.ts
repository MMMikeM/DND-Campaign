import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflictParticipants, conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemNotableHistory, itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { narrativeDestinationParticipants, narrativeDestinations } from "../narrative-destinations/tables"
import { consequences } from "../narrative-events/tables"
import { questHooks, quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { npcStageInvolvement, questStages } from "../stages/tables"
import { npcFactionMemberships, npcRelations, npcSiteAssociations, npcs } from "./tables"

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
			siteAssociations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb(${npcSiteAssociations}.*), 'site', jsonb_build_object('id', ${sites.id}, 'name', ${sites.name}, 'area', jsonb_build_object('id', ${areas.id}, 'name', ${areas.name}, 'region', jsonb_build_object('id', ${regions.id}, 'name', ${regions.name}))))) FILTER (WHERE ${npcSiteAssociations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"site_associations",
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
			itemHistory:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemNotableHistory}.*)) FILTER (WHERE ${itemNotableHistory.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_history",
				),
			itemRelations:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemRelations}.*)) FILTER (WHERE ${itemRelations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_relations",
				),
			narrativeDestinationInvolvement:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(${narrativeDestinationParticipants}.*), 'destination', jsonb_build_object('id', ${narrativeDestinations.id}, 'name', ${narrativeDestinations.name}))) FILTER (WHERE ${narrativeDestinationParticipants.id} IS NOT NULL), '[]'::jsonb)`.as(
					"narrative_destination_involvement",
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
		.leftJoin(npcSiteAssociations, sql`${npcSiteAssociations.npcId} = ${npcs.id}`)
		.leftJoin(sites, sql`${npcSiteAssociations.siteId} = ${sites.id}`)
		.leftJoin(areas, sql`${sites.areaId} = ${areas.id}`)
		.leftJoin(regions, sql`${areas.regionId} = ${regions.id}`)
		.leftJoin(conflictParticipants, sql`${conflictParticipants.npcId} = ${npcs.id}`)
		.leftJoin(conflicts, sql`${conflictParticipants.conflictId} = ${conflicts.id}`)
		.leftJoin(
			consequences,
			sql`${consequences.affectedEntityType} = 'npc' AND ${consequences.affectedEntityId} = ${npcs.id}`,
		)
		.leftJoin(
			sql`${foreshadowing} AS fs_out`,
			sql`fs_out.source_entity_type = 'npc' AND fs_out.source_entity_id = ${npcs.id}`,
		)
		.leftJoin(
			sql`${foreshadowing} AS fs_in`,
			sql`fs_in.target_entity_type = 'npc' AND fs_in.target_entity_id = ${npcs.id}`,
		)
		.leftJoin(itemNotableHistory, sql`${itemNotableHistory.keyNpcId} = ${npcs.id}`)
		.leftJoin(
			itemRelations,
			sql`${itemRelations.targetEntityType} = 'npc' AND ${itemRelations.targetEntityId} = ${npcs.id}`,
		)
		.leftJoin(narrativeDestinationParticipants, sql`${narrativeDestinationParticipants.npcId} = ${npcs.id}`)
		.leftJoin(
			narrativeDestinations,
			sql`${narrativeDestinationParticipants.narrativeDestinationId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(questHooks, sql`${questHooks.deliveryNpcId} = ${npcs.id}`)
		.leftJoin(sql`${quests} AS qh_quest`, sql`${questHooks.questId} = qh_quest.id`)
		.leftJoin(sql`${questStages} AS qs_delivery`, sql`qs_delivery.delivery_npc_id = ${npcs.id}`)
		.leftJoin(sql`${quests} AS q_stage_delivery`, sql`qs_delivery.quest_id = q_stage_delivery.id`)
		.leftJoin(npcStageInvolvement, sql`${npcStageInvolvement.npcId} = ${npcs.id}`)
		.leftJoin(sql`${questStages} AS si`, sql`${npcStageInvolvement.questStageId} = si.id`)
		.leftJoin(sql`${quests} AS q_involvement`, sql`si.quest_id = q_involvement.id`)
		.leftJoin(loreLinks, sql`${loreLinks.targetEntityType} = 'npc' AND ${loreLinks.targetEntityId} = ${npcs.id}`)
		.leftJoin(sql`${npcRelations} AS nr_out`, sql`nr_out.source_npc_id = ${npcs.id}`)
		.leftJoin(sql`${npcs} AS rn_out`, sql`nr_out.target_npc_id = rn_out.id`)
		.leftJoin(sql`${npcRelations} AS nr_in`, sql`nr_in.target_npc_id = ${npcs.id}`)
		.leftJoin(sql`${npcs} AS sn_in`, sql`nr_in.source_npc_id = sn_in.id`)
		.groupBy(npcs.id),
)

// -- View for aggregating NPC data for the search index
// CREATE OR REPLACE VIEW npc_search_data_view AS
// SELECT
//   n.id,
//   'npcs' AS source_table,
//   to_jsonb(n.*) AS entity_main,
//   -- Select specific columns based on entities/npcs.ts
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(nf.*), 'faction', jsonb_build_object('id', f.id, 'name', f.name))) FILTER (WHERE nf.id IS NOT NULL), '[]'::jsonb) AS related_factions,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('association', to_jsonb(ns.*), 'site', jsonb_build_object('id', s.id, 'name', s.name, 'area', jsonb_build_object('id', a.id, 'name', a.name, 'region', jsonb_build_object('id', r.id, 'name', r.name))))) FILTER (WHERE ns.id IS NOT NULL), '[]'::jsonb) AS related_site_associations,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(cp.*), 'conflict', jsonb_build_object('id', mc.id, 'name', mc.name))) FILTER (WHERE cp.id IS NOT NULL), '[]'::jsonb) AS related_conflict_participation,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c.id, 'description', c.description)) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS related_consequences,
//   COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_target.*)) FILTER (WHERE fs_target.id IS NOT NULL), '[]'::jsonb) AS related_target_foreshadowing,
//   COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_source.*)) FILTER (WHERE fs_source.id IS NOT NULL), '[]'::jsonb) AS related_source_foreshadowing,
//   COALESCE(jsonb_agg(DISTINCT to_jsonb(ih.*)) FILTER (WHERE ih.id IS NOT NULL), '[]'::jsonb) AS related_item_history,
//   COALESCE(jsonb_agg(DISTINCT to_jsonb(ir.*)) FILTER (WHERE ir.id IS NOT NULL), '[]'::jsonb) AS related_item_relationships,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(dpi.*), 'destination', jsonb_build_object('id', nd.id, 'name', nd.name))) FILTER (WHERE dpi.id IS NOT NULL), '[]'::jsonb) AS related_destination_involvement,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qh.id, 'source', qh.source, 'hook_content', qh.hook_content)) FILTER (WHERE qh.id IS NOT NULL), '[]'::jsonb) AS related_quest_hooks,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', qs.id, 'name', qs.name, 'quest', jsonb_build_object('id', q_stage_delivery.id, 'name', q_stage_delivery.name))) FILTER (WHERE qs.id IS NOT NULL), '[]'::jsonb) AS related_quest_stage_deliveries,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('involvement', to_jsonb(nsi.*), 'stage', jsonb_build_object('id', si.id, 'name', si.name), 'quest', jsonb_build_object('id', q_involvement.id, 'name', q_involvement.name))) FILTER (WHERE nsi.id IS NOT NULL), '[]'::jsonb) AS related_stage_involvement,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', wcl.id, 'concept_id', wcl.world_concept_id)) FILTER (WHERE wcl.id IS NOT NULL), '[]'::jsonb) AS related_world_concept_links,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_out.*), 'relatedNpc', jsonb_build_object('id', rn_out.id, 'name', rn_out.name))) FILTER (WHERE nr_out.id IS NOT NULL), '[]'::jsonb) AS related_outgoing_relationships,
//   COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(nr_in.*), 'sourceNpc', jsonb_build_object('id', sn_in.id, 'name', sn_in.name))) FILTER (WHERE nr_in.id IS NOT NULL), '[]'::jsonb) AS related_incoming_relationships
// FROM
//   npcs n
// LEFT JOIN npc_faction_memberships nf ON nf.npc_id = n.id
// LEFT JOIN factions f ON nf.faction_id = f.id
// LEFT JOIN npc_site_associations ns ON ns.npc_id = n.id
// LEFT JOIN sites s ON ns.site_id = s.id
// LEFT JOIN areas a ON s.area_id = a.id
// LEFT JOIN regions r ON a.region_id = r.id
// LEFT JOIN conflict_participants cp ON cp.npc_id = n.id
// LEFT JOIN conflicts mc ON cp.conflict_id = mc.id
// LEFT JOIN consequences c ON c.affected_npc_id = n.id
// LEFT JOIN foreshadowing fs_target ON fs_target.target_npc_id = n.id
// LEFT JOIN foreshadowing fs_source ON fs_source.source_npc_id = n.id
// LEFT JOIN item_notable_history ih ON ih.key_npc_id = n.id
// LEFT JOIN item_relationships ir ON ir.target_npc_id = n.id
// LEFT JOIN narrative_destination_participants dpi ON dpi.npc_id = n.id
// LEFT JOIN narrative_destinations nd ON dpi.narrative_destination_id = nd.id
// LEFT JOIN quest_hooks qh ON qh.delivery_npc_id = n.id
// LEFT JOIN quests q_delivery ON qh.quest_id = q_delivery.id
// LEFT JOIN quest_stages qs ON qs.delivery_npc_id = n.id
// LEFT JOIN quests q_stage_delivery ON qs.quest_id = q_stage_delivery.id
// LEFT JOIN npc_stage_involvement nsi ON nsi.npc_id = n.id
// LEFT JOIN quest_stages si ON nsi.quest_stage_id = si.id
// LEFT JOIN quests q_involvement ON si.quest_id = q_involvement.id
// LEFT JOIN world_concept_links wcl ON wcl.npc_id = n.id
// LEFT JOIN npc_relationships nr_out ON nr_out.source_npc_id = n.id
// LEFT JOIN npcs rn_out ON nr_out.target_npc_id = rn_out.id
// LEFT JOIN npc_relationships nr_in ON nr_in.target_npc_id = n.id
// LEFT JOIN npcs sn_in ON nr_in.source_npc_id = sn_in.id
// GROUP BY
//   n.id;
