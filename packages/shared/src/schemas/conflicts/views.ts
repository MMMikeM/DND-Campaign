import { eq, sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { consequences } from "../consequences/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemConnections } from "../items/tables"
import { loreLinks } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { regions } from "../regions/tables"
import { entityJson, jsonAgg, jsonObject, optionalEntityJson } from "../view-utils"
import { conflictParticipants, conflicts } from "./tables"

export const conflictSearchDataView = pgView("conflict_search_data_view").as((qb) =>
	qb
		.select({
			id: conflicts.id,
			sourceTable: sql<string>`'conflicts'`.as("source_table"),
			entityMain: sql`to_jsonb(${conflicts}.*)`.as("entity_main"),
			region: sql`COALESCE(${entityJson(regions)}, '{}'::jsonb)`.as("region"),
			participants: jsonAgg(
				jsonObject([
					sql`'participant', to_jsonb(${conflictParticipants}.*)`,
					optionalEntityJson("faction", conflictParticipants.factionId, factions),
					optionalEntityJson("npc", conflictParticipants.npcId, npcs),
				]),
				conflictParticipants.id,
			).as("participants"),
			affectedByConsequences: jsonAgg(
				sql`jsonb_build_object('id', ${consequences.id}, 'name', ${consequences.name}, 'description', ${consequences.description})`,
				consequences.id,
			).as("affected_by_consequences"),
			incomingForeshadowing: jsonAgg(sql`to_jsonb(${foreshadowing}.*)`, foreshadowing.id).as("incoming_foreshadowing"),
			itemConnections: jsonAgg(sql`to_jsonb(${itemConnections}.*)`, itemConnections.id).as("item_connections"),
			loreLinks: jsonAgg(
				sql`jsonb_build_object('id', ${loreLinks.id}, 'lore_id', ${loreLinks.loreId})`,
				loreLinks.id,
			).as("lore_links"),
		})
		.from(conflicts)
		.leftJoin(regions, eq(conflicts.regionId, regions.id))
		.leftJoin(conflictParticipants, eq(conflictParticipants.conflictId, conflicts.id))
		.leftJoin(factions, eq(conflictParticipants.factionId, factions.id))
		.leftJoin(npcs, eq(conflictParticipants.npcId, npcs.id))
		.leftJoin(consequences, eq(consequences.affectedConflictId, conflicts.id))
		.leftJoin(foreshadowing, eq(foreshadowing.targetConflictId, conflicts.id))
		.leftJoin(itemConnections, eq(itemConnections.connectedConflictId, conflicts.id))
		.leftJoin(loreLinks, eq(loreLinks.conflictId, conflicts.id))
		.groupBy(conflicts.id, regions.id),
)
