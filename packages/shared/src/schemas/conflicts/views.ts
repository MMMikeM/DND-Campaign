import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { regions } from "../regions/tables"

import { conflictParticipants, conflicts } from "./tables"

export const conflictSearchDataView = pgView("conflict_search_data_view").as((qb) =>
	qb
		.select({
			id: conflicts.id,
			sourceTable: sql<string>`'conflicts'`.as("source_table"),
			entityMain: sql<string>`to_jsonb(${conflicts})`.as("entity_main"),
			region: sql<string>`COALESCE(jsonb_build_object('id', ${regions.id}, 'name', ${regions.name}), '{}'::jsonb)`.as(
				"region",
			),
			participants: sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
    'participant', to_jsonb(${conflictParticipants}.*),
    'faction', CASE WHEN ${conflictParticipants.factionId} IS NOT NULL THEN jsonb_build_object('id', ${factions.id}, 'name', ${factions.name}) END,
    'npc', CASE WHEN ${conflictParticipants.npcId} IS NOT NULL THEN jsonb_build_object('id', ${npcs.id}, 'name', ${npcs.name}) END
  )) FILTER (WHERE ${conflictParticipants.id} IS NOT NULL), '[]'::jsonb)`.as("participants"),
			consequences:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_caused.id, 'description', c_caused.description)) FILTER (WHERE c_caused.id IS NOT NULL), '[]'::jsonb)`.as(
					"consequences",
				),
			affectedByConsequences:
				sql<string>`COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', c_affecting.id, 'description', c_affecting.description)) FILTER (WHERE c_affecting.id IS NOT NULL), '[]'::jsonb)`.as(
					"affectedByConsequences",
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
		})
		.from(conflicts)
		.leftJoin(regions, sql`${conflicts.regionId} = ${regions.id}`)
		.leftJoin(conflictParticipants, sql`${conflictParticipants.conflictId} = ${conflicts.id}`)
		.leftJoin(factions, sql`${conflictParticipants.factionId} = ${factions.id}`)
		.leftJoin(npcs, sql`${conflictParticipants.npcId} = ${npcs.id}`)
		.leftJoin(sql`${consequences} AS c_caused`, sql`c_caused.trigger_conflict_id = ${conflicts.id}`)
		.leftJoin(sql`${consequences} AS c_affecting`, sql`c_affecting.affected_conflict_id = ${conflicts.id}`)
		.leftJoin(foreshadowing, sql`${foreshadowing.targetConflictId} = ${conflicts.id}`)
		.leftJoin(loreLinks, sql`${loreLinks.conflictId} = ${conflicts.id}`)
		.groupBy(conflicts.id, regions.id),
)
