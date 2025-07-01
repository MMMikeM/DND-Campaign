import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { items } from "../items/tables"
import { lore } from "../lore/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { sites } from "../regions/tables"
import { questStages } from "../stages/tables"
import { foreshadowing } from "./tables"

export const foreshadowingSearchDataView = pgView("foreshadowing_search_data_view").as((qb) =>
	qb
		.select({
			id: foreshadowing.id,
			sourceTable: sql<string>`'foreshadowing'`.as("source_table"),
			entityMain: sql<string>`to_jsonb(${foreshadowing})`.as("entity_main"),
			sourceQuest: sql<string>`COALESCE(jsonb_build_object('id', sq.id, 'name', sq.name), '{}'::jsonb)`.as(
				"sourceQuest",
			),
			sourceQuestStage:
				sql<string>`COALESCE(jsonb_build_object('stage', jsonb_build_object('id', sqs.id, 'name', sqs.name), 'quest', jsonb_build_object('id', sq_stage.id, 'name', sq_stage.name)), '{}'::jsonb)`.as(
					"sourceQuestStage",
				),
			sourceSite: sql<string>`COALESCE(jsonb_build_object('id', ss.id, 'name', ss.name), '{}'::jsonb)`.as("sourceSite"),
			sourceNpc: sql<string>`COALESCE(jsonb_build_object('id', sn.id, 'name', sn.name), '{}'::jsonb)`.as("sourceNpc"),
			sourceLore: sql<string>`COALESCE(jsonb_build_object('id', sl.id, 'name', sl.name), '{}'::jsonb)`.as("sourceLore"),
			targetQuest: sql<string>`COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb)`.as(
				"targetQuest",
			),
			targetNpc: sql<string>`COALESCE(jsonb_build_object('id', tn.id, 'name', tn.name), '{}'::jsonb)`.as("targetNpc"),
			targetNarrativeEvent: sql<string>`COALESCE(jsonb_build_object('id', tne.id, 'name', tne.name), '{}'::jsonb)`.as(
				"targetNarrativeEvent",
			),
			targetConflict: sql<string>`COALESCE(jsonb_build_object('id', tmc.id, 'name', tmc.name), '{}'::jsonb)`.as(
				"targetConflict",
			),
			targetItem: sql<string>`COALESCE(jsonb_build_object('id', ti.id, 'name', ti.name), '{}'::jsonb)`.as("targetItem"),
			targetLore: sql<string>`COALESCE(jsonb_build_object('id', tl.id, 'name', tl.name), '{}'::jsonb)`.as("targetLore"),
			targetFaction: sql<string>`COALESCE(jsonb_build_object('id', tf.id, 'name', tf.name), '{}'::jsonb)`.as(
				"targetFaction",
			),
			targetSite: sql<string>`COALESCE(jsonb_build_object('id', ts.id, 'name', ts.name), '{}'::jsonb)`.as("targetSite"),
		})
		.from(foreshadowing)
		.leftJoin(sql`${quests} AS sq`, sql`${foreshadowing.sourceQuestId} = sq.id`)
		.leftJoin(sql`${questStages} AS sqs`, sql`${foreshadowing.sourceQuestStageId} = sqs.id`)
		.leftJoin(sql`${quests} AS sq_stage`, sql`sqs.quest_id = sq_stage.id`)
		.leftJoin(sql`${sites} AS ss`, sql`${foreshadowing.sourceSiteId} = ss.id`)
		.leftJoin(sql`${npcs} AS sn`, sql`${foreshadowing.sourceNpcId} = sn.id`)
		.leftJoin(sql`${lore} AS sl`, sql`${foreshadowing.sourceLoreId} = sl.id`)
		.leftJoin(sql`${quests} AS tq`, sql`${foreshadowing.targetQuestId} = tq.id`)
		.leftJoin(sql`${npcs} AS tn`, sql`${foreshadowing.targetNpcId} = tn.id`)
		.leftJoin(sql`${conflicts} AS tmc`, sql`${foreshadowing.targetConflictId} = tmc.id`)
		.leftJoin(sql`${items} AS ti`, sql`${foreshadowing.targetItemId} = ti.id`)
		.leftJoin(sql`${lore} AS tl`, sql`${foreshadowing.targetLoreId} = tl.id`)
		.leftJoin(sql`${factions} AS tf`, sql`${foreshadowing.targetFactionId} = tf.id`)
		.leftJoin(sql`${sites} AS ts`, sql`${foreshadowing.targetSiteId} = ts.id`)
		.groupBy(
			foreshadowing.id,
			sql`sq.id`,
			sql`sqs.id`,
			sql`sq_stage.id`,
			sql`ss.id`,
			sql`sn.id`,
			sql`sl.id`,
			sql`tq.id`,
			sql`tn.id`,
			sql`tne.id`,
			sql`tmc.id`,
			sql`ti.id`,
			sql`tnd.id`,
			sql`tl.id`,
			sql`tf.id`,
			sql`ts.id`,
		),
)
