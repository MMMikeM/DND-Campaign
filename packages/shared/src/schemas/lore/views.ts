import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { items } from "../items/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
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
					'region', CASE WHEN ${loreLinks.regionId} IS NOT NULL THEN jsonb_build_object('id', lr.id, 'name', lr.name) END,
					'faction', CASE WHEN ${loreLinks.factionId} IS NOT NULL THEN jsonb_build_object('id', lf.id, 'name', lf.name) END,
					'npc', CASE WHEN ${loreLinks.npcId} IS NOT NULL THEN jsonb_build_object('id', ln.id, 'name', ln.name) END,
					'conflict', CASE WHEN ${loreLinks.conflictId} IS NOT NULL THEN jsonb_build_object('id', lc.id, 'name', lc.name) END,
					'quest', CASE WHEN ${loreLinks.questId} IS NOT NULL THEN jsonb_build_object('id', lq.id, 'name', lq.name) END,
					'foreshadowing', CASE WHEN ${loreLinks.foreshadowingId} IS NOT NULL THEN jsonb_build_object('id', lfs.id, 'name', lfs.name) END,
					'narrativeDestination', CASE WHEN ${loreLinks.narrativeDestinationId} IS NOT NULL THEN jsonb_build_object('id', lnd.id, 'name', lnd.name) END,
					'relatedLore', CASE WHEN ${loreLinks.relatedLoreId} IS NOT NULL THEN jsonb_build_object('id', ll.id, 'name', ll.name) END,
					'item', CASE WHEN ${loreLinks.itemId} IS NOT NULL THEN jsonb_build_object('id', li.id, 'name', li.name) END
				)) FILTER (WHERE ${loreLinks.id} IS NOT NULL), '[]'::jsonb)`.as("links"),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
			outgoingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(fs_out.*)) FILTER (WHERE fs_out.id IS NOT NULL), '[]'::jsonb)`.as(
					"outgoing_foreshadowing",
				),
		})
		.from(lore)
		.leftJoin(loreLinks, sql`${loreLinks.loreId} = ${lore.id}`)
		.leftJoin(sql`${regions} AS lr`, sql`${loreLinks.regionId} = lr.id`)
		.leftJoin(sql`${factions} AS lf`, sql`${loreLinks.factionId} = lf.id`)
		.leftJoin(sql`${npcs} AS ln`, sql`${loreLinks.npcId} = ln.id`)
		.leftJoin(sql`${conflicts} AS lc`, sql`${loreLinks.conflictId} = lc.id`)
		.leftJoin(sql`${quests} AS lq`, sql`${loreLinks.questId} = lq.id`)
		.leftJoin(sql`${lore} AS ll`, sql`${loreLinks.relatedLoreId} = ll.id`)
		.leftJoin(sql`${foreshadowing} AS lfs`, sql`${loreLinks.foreshadowingId} = lfs.id`)
		.leftJoin(sql`${narrativeDestinations} AS lnd`, sql`${loreLinks.narrativeDestinationId} = lnd.id`)
		.leftJoin(sql`${items} as li`, sql`${loreLinks.itemId} = li.id`)
		.leftJoin(foreshadowing, sql`${foreshadowing.targetLoreId} = ${lore.id}`)
		.leftJoin(sql`${foreshadowing} as fs_out`, sql`fs_out.source_lore_id = ${lore.id}`)
		.groupBy(lore.id),
)
