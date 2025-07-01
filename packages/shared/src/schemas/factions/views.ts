import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflictParticipants, conflicts } from "../conflicts/tables"
import { consequences } from "../consequences/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcFactionMemberships, npcs } from "../npcs/tables"
import { questHooks, questParticipants, quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { factionAgendas, factionDiplomacy, factionInfluence, factions } from "./tables"

export const factionSearchDataView = pgView("faction_search_data_view").as((qb) =>
	qb
		.select({
			id: factions.id,
			sourceTable: sql<string>`'factions'`.as("source_table"),
			entityMain: sql<string>`to_jsonb(${factions})`.as("entity_main"),
			primaryHqSite:
				sql<string>`COALESCE(jsonb_build_object('id', ${sites.id}, 'name', ${sites.name}), '{}'::jsonb)`.as(
					"primaryHqSite",
				),
			agendas:
				sql<string>`COALESCE(jsonb_agg(DISTINCT to_jsonb(${factionAgendas}.*)) FILTER (WHERE ${factionAgendas.id} IS NOT NULL), '[]'::jsonb)`.as(
					"agendas",
				),
			members:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('membership', to_jsonb(${npcFactionMemberships}.*), 'npc', jsonb_build_object('id', ${npcs.id}, 'name', ${npcs.name}))) FILTER (WHERE ${npcFactionMemberships.id} IS NOT NULL), '[]'::jsonb)`.as(
					"members",
				),
			questHooks:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${questHooks.id}, 'source', ${questHooks.source}, 'hook_content', ${questHooks.hookContent})) FILTER (WHERE ${questHooks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"questHooks",
				),
			questParticipation:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participation', to_jsonb(qp.*), 'quest', jsonb_build_object('id', q.id, 'name', q.name))) FILTER (WHERE qp.id IS NOT NULL), '[]'::jsonb)`.as(
					"questParticipation",
				),
			influence: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
      'influence', to_jsonb(${factionInfluence}.*),
      'region', CASE WHEN ${factionInfluence.regionId} IS NOT NULL THEN jsonb_build_object('id', r.id, 'name', r.name) END,
      'area', CASE WHEN ${factionInfluence.areaId} IS NOT NULL THEN jsonb_build_object('id', a.id, 'name', a.name) END,
      'site', CASE WHEN ${factionInfluence.siteId} IS NOT NULL THEN jsonb_build_object('id', s.id, 'name', s.name) END
    )) FILTER (WHERE ${factionInfluence.id} IS NOT NULL), '[]'::jsonb)`.as("influence"),
			conflicts:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('participant', to_jsonb(${conflictParticipants}.*), 'conflict', jsonb_build_object('id', ${conflicts.id}, 'name', ${conflicts.name}))) FILTER (WHERE ${conflictParticipants.id} IS NOT NULL), '[]'::jsonb)`.as(
					"conflicts",
				),
			consequences:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${consequences.id}, 'description', ${consequences.description})) FILTER (WHERE ${consequences.id} IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
			incomingForeshadowing:
				sql<string>`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incomingForeshadowing",
				),
			itemConnections:
				sql<string>`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemConnections}.*)) FILTER (WHERE ${itemConnections.id} IS NOT NULL), '[]'::jsonb)`.as(
					"itemConnections",
				),
			loreLinks:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as(
					"loreLinks",
				),
			incomingRelations:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_in.*), 'sourceFaction', jsonb_build_object('id', sf.id, 'name', sf.name))) FILTER (WHERE fd_in.id IS NOT NULL), '[]'::jsonb)`.as(
					"incomingRelations",
				),
			outgoingRelations:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('relation', to_jsonb(fd_out.*), 'targetFaction', jsonb_build_object('id', tf.id, 'name', tf.name))) FILTER (WHERE fd_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoingRelations",
				),
		})
		.from(factions)
		.leftJoin(sites, sql`${factions.hqSiteId} = ${sites.id}`)
		.leftJoin(factionAgendas, sql`${factionAgendas.factionId} = ${factions.id}`)
		.leftJoin(npcFactionMemberships, sql`${npcFactionMemberships.factionId} = ${factions.id}`)
		.leftJoin(npcs, sql`${npcFactionMemberships.npcId} = ${npcs.id}`)
		.leftJoin(questHooks, sql`${questHooks.factionId} = ${factions.id}`)
		.leftJoin(sql`${questParticipants} AS qp`, sql`qp.faction_id = ${factions.id}`)
		.leftJoin(sql`${quests} AS q`, sql`qp.quest_id = q.id`)
		.leftJoin(factionInfluence, sql`${factionInfluence.factionId} = ${factions.id}`)
		.leftJoin(sql`${regions} AS r`, sql`${factionInfluence.regionId} = r.id`)
		.leftJoin(sql`${areas} AS a`, sql`${factionInfluence.areaId} = a.id`)
		.leftJoin(sql`${sites} AS s`, sql`${factionInfluence.siteId} = s.id`)
		.leftJoin(conflictParticipants, sql`${conflictParticipants.factionId} = ${factions.id}`)
		.leftJoin(conflicts, sql`${conflictParticipants.conflictId} = ${conflicts.id}`)
		.leftJoin(consequences, sql`${consequences.affectedFactionId} = ${factions.id}`)
		.leftJoin(foreshadowing, sql`${foreshadowing.targetFactionId} = ${factions.id}`)
		.leftJoin(itemConnections, sql`${itemConnections.connectedFactionId} = ${factions.id}`)
		.leftJoin(loreLinks, sql`${loreLinks.factionId} = ${factions.id}`)
		.leftJoin(sql`${factionDiplomacy} AS fd_in`, sql`fd_in.target_faction_id = ${factions.id}`)
		.leftJoin(sql`${factions} AS sf`, sql`fd_in.source_faction_id = sf.id`)
		.leftJoin(sql`${factionDiplomacy} AS fd_out`, sql`fd_out.source_faction_id = ${factions.id}`)
		.leftJoin(sql`${factions} AS tf`, sql`fd_out.target_faction_id = tf.id`)
		.groupBy(factions.id, sites.id),
)
