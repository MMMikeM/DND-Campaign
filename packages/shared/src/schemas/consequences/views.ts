import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { consequences } from "./tables"

export const consequenceSearchDataView = pgView("consequence_search_data_view").as((qb) =>
	qb
		.select({
			id: consequences.id,
			sourceTable: sql<string>`'consequences'`.as("source_table"),
			entityMain: sql`to_jsonb(${consequences}.*)`.as("entity_main"),
			// Trigger entity relationships
			triggerQuest: sql`COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb)`.as("trigger_quest"),
			// Affected entity relationships
			affectedFaction: sql`COALESCE(jsonb_build_object('id', af.id, 'name', af.name), '{}'::jsonb)`.as(
				"affected_faction",
			),
			affectedRegion: sql`COALESCE(jsonb_build_object('id', ar.id, 'name', ar.name), '{}'::jsonb)`.as(
				"affected_region",
			),
			affectedArea: sql`COALESCE(jsonb_build_object('id', aa.id, 'name', aa.name), '{}'::jsonb)`.as("affected_area"),
			affectedSite: sql`COALESCE(jsonb_build_object('id', as_.id, 'name', as_.name), '{}'::jsonb)`.as("affected_site"),
			affectedNpc: sql`COALESCE(jsonb_build_object('id', an.id, 'name', an.name), '{}'::jsonb)`.as("affected_npc"),
			affectedConflict: sql`COALESCE(jsonb_build_object('id', ac.id, 'name', ac.name), '{}'::jsonb)`.as(
				"affected_conflict",
			),
			affectedQuest: sql`COALESCE(jsonb_build_object('id', aq.id, 'name', aq.name), '{}'::jsonb)`.as("affected_quest"),
		})
		.from(consequences)
		// Trigger entity joins
		.leftJoin(sql`${quests} AS tq`, sql`${consequences.triggerQuestId} = tq.id`)
		// Affected entity joins
		.leftJoin(sql`${factions} AS af`, sql`${consequences.affectedFactionId} = af.id`)
		.leftJoin(sql`${regions} AS ar`, sql`${consequences.affectedRegionId} = ar.id`)
		.leftJoin(sql`${areas} AS aa`, sql`${consequences.affectedAreaId} = aa.id`)
		.leftJoin(sql`${sites} AS as_`, sql`${consequences.affectedSiteId} = as_.id`)
		.leftJoin(sql`${npcs} AS an`, sql`${consequences.affectedNpcId} = an.id`)
		.leftJoin(sql`${conflicts} AS ac`, sql`${consequences.affectedConflictId} = ac.id`)
		.leftJoin(sql`${quests} AS aq`, sql`${consequences.affectedQuestId} = aq.id`)
		.groupBy(
			consequences.id,
			sql`tq.id`,
			sql`af.id`,
			sql`ar.id`,
			sql`aa.id`,
			sql`as_.id`,
			sql`an.id`,
			sql`ac.id`,
			sql`aq.id`,
		),
)
