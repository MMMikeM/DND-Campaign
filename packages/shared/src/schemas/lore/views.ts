import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { itemRelations } from "../items/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { regions } from "../regions/tables"
import { lore, loreLinks } from "./tables"

export const loreSearchDataView = pgView("lore_search_data_view").as((qb) =>
	qb
		.select({
			id: lore.id,
			sourceTable: sql<string>`'lore'`.as("source_table"),
			entityMain: sql`to_jsonb(${lore}.*)`.as("entity_main"),
			links: sql`COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
					'link', to_jsonb(${loreLinks}.*),
					'region', CASE WHEN ${loreLinks.targetEntityType} = 'region' THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN ${loreLinks.targetEntityType} = 'faction' THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN ${loreLinks.targetEntityType} = 'npc' THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN ${loreLinks.targetEntityType} = 'conflict' THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN ${loreLinks.targetEntityType} = 'quest' THEN jsonb_build_object('id', lq.id, 'name', lq.name) END
				)) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as("links"),
			itemRelations:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${itemRelations}.*)) FILTER (WHERE ${itemRelations.id} IS NOT NULL), '[]'::jsonb)`.as(
					"item_relations",
				),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
		})
		.from(lore)
		.leftJoin(loreLinks, sql`${loreLinks.loreId} = ${lore.id}`)
		.leftJoin(
			sql`${regions} AS lr`,
			sql`${loreLinks.targetEntityType} = 'region' AND ${loreLinks.targetEntityId} = lr.id`,
		)
		.leftJoin(
			sql`${factions} AS lf`,
			sql`${loreLinks.targetEntityType} = 'faction' AND ${loreLinks.targetEntityId} = lf.id`,
		)
		.leftJoin(sql`${npcs} AS ln`, sql`${loreLinks.targetEntityType} = 'npc' AND ${loreLinks.targetEntityId} = ln.id`)
		.leftJoin(
			sql`${conflicts} AS lc`,
			sql`${loreLinks.targetEntityType} = 'conflict' AND ${loreLinks.targetEntityId} = lc.id`,
		)
		.leftJoin(
			sql`${quests} AS lq`,
			sql`${loreLinks.targetEntityType} = 'quest' AND ${loreLinks.targetEntityId} = lq.id`,
		)
		.leftJoin(
			itemRelations,
			sql`${itemRelations.targetEntityType} = 'lore' AND ${itemRelations.targetEntityId} = ${lore.id}`,
		)
		.leftJoin(
			foreshadowing,
			sql`${foreshadowing.targetEntityType} = 'lore' AND ${foreshadowing.targetEntityId} = ${lore.id}`,
		)
		.groupBy(lore.id),
)
