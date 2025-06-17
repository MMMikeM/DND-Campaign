import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import {
	narrativeDestinationParticipants,
	narrativeDestinationQuestRoles,
	narrativeDestinationRelations,
	narrativeDestinations,
} from "./tables"

export const narrativeDestinationSearchDataView = pgView("narrative_destination_search_data_view").as((qb) =>
	qb
		.select({
			id: narrativeDestinations.id,
			sourceTable: sql<string>`'narrative_destinations'`.as("source_table"),
			entityMain: sql`to_jsonb(${narrativeDestinations}.*)`.as("entity_main"),
			region: sql`COALESCE(jsonb_build_object('id', ${regions.id}, 'name', ${regions.name}), '{}'::jsonb)`.as("region"),
			conflict: sql`COALESCE(jsonb_build_object('id', ${conflicts.id}, 'name', ${conflicts.name}), '{}'::jsonb)`.as(
				"conflict",
			),
			questRoles:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('role', to_jsonb(${narrativeDestinationQuestRoles}.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE ${narrativeDestinationQuestRoles.id} IS NOT NULL), '[]'::jsonb)`.as(
					"quest_roles",
				),
			participantInvolvement: sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
				'involvement', to_jsonb(${narrativeDestinationParticipants}.*),
				'npc', CASE WHEN ${narrativeDestinationParticipants.npcId} IS NOT NULL THEN jsonb_build_object('id', n.id, 'name', n.name) END,
				'faction', CASE WHEN ${narrativeDestinationParticipants.factionId} IS NOT NULL THEN jsonb_build_object('id', f.id, 'name', f.name) END
			)) FILTER (WHERE ${narrativeDestinationParticipants.id} IS NOT NULL), '[]'::jsonb)`.as("participant_involvement"),
			itemRelations:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemRelations}.*)) FILTER (WHERE ${itemRelations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_relations",
				),
			loreLinks:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"lore_links",
				),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
			outgoingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_out.*), 'relatedDestination', jsonb_build_object('id', rd_out.id, 'name', rd_out.name))) FILTER (WHERE dr_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_relations",
				),
			incomingRelations:
				sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relationship', to_jsonb(dr_in.*), 'sourceDestination', jsonb_build_object('id', sd_in.id, 'name', sd_in.name))) FILTER (WHERE dr_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_relations",
				),
		})
		.from(narrativeDestinations)
		.leftJoin(regions, sql`${narrativeDestinations.regionId} = ${regions.id}`)
		.leftJoin(conflicts, sql`${narrativeDestinations.conflictId} = ${conflicts.id}`)
		.leftJoin(
			narrativeDestinationQuestRoles,
			sql`${narrativeDestinationQuestRoles.narrativeDestinationId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(sql`${quests} AS q`, sql`${narrativeDestinationQuestRoles.questId} = q.id`)
		.leftJoin(
			narrativeDestinationParticipants,
			sql`${narrativeDestinationParticipants.narrativeDestinationId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(sql`${npcs} AS n`, sql`${narrativeDestinationParticipants.npcId} = n.id`)
		.leftJoin(sql`${factions} AS f`, sql`${narrativeDestinationParticipants.factionId} = f.id`)
		.leftJoin(
			itemRelations,
			sql`${itemRelations.targetEntityType} = 'narrative_destination' AND ${itemRelations.targetEntityId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(
			loreLinks,
			sql`${loreLinks.targetEntityType} = 'narrative_destination' AND ${loreLinks.targetEntityId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(
			foreshadowing,
			sql`${foreshadowing.targetEntityType} = 'narrative_destination' AND ${foreshadowing.targetEntityId} = ${narrativeDestinations.id}`,
		)
		.leftJoin(
			sql`${narrativeDestinationRelations} AS dr_out`,
			sql`dr_out.source_destination_id = ${narrativeDestinations.id}`,
		)
		.leftJoin(sql`${narrativeDestinations} AS rd_out`, sql`dr_out.target_destination_id = rd_out.id`)
		.leftJoin(
			sql`${narrativeDestinationRelations} AS dr_in`,
			sql`dr_in.target_destination_id = ${narrativeDestinations.id}`,
		)
		.leftJoin(sql`${narrativeDestinations} AS sd_in`, sql`dr_in.source_destination_id = sd_in.id`)
		.groupBy(narrativeDestinations.id, regions.id, conflicts.id),
)
