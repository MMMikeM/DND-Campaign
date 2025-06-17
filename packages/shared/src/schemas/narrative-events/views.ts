import { sql } from "drizzle-orm"
import { pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { foreshadowing } from "../foreshadowing/tables"
import { narrativeDestinations } from "../narrative-destinations/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions, questStages } from "../stages/tables"
import { consequences, narrativeEvents } from "./tables"

export const narrativeEventSearchDataView = pgView("narrative_event_search_data_view").as((qb) =>
	qb
		.select({
			id: narrativeEvents.id,
			sourceTable: sql<string>`'narrative_events'`.as("source_table"),
			entityMain: sql`to_jsonb(${narrativeEvents}.*)`.as("entity_main"),
			questStage:
				sql`COALESCE(jsonb_build_object('stage', jsonb_build_object('id', ${questStages.id}, 'name', ${questStages.name}), 'quest', jsonb_build_object('id', sq.id, 'name', sq.name)), '{}'::jsonb)`.as(
					"quest_stage",
				),
			triggeringStageDecision:
				sql`COALESCE(jsonb_build_object('id', ${questStageDecisions.id}, 'name', ${questStageDecisions.name}), '{}'::jsonb)`.as(
					"triggering_stage_decision",
				),
			relatedQuest: sql`COALESCE(jsonb_build_object('id', ${sql`rq`}.id, 'name', ${sql`rq`}.name), '{}'::jsonb)`.as(
				"related_quest",
			),
			incomingForeshadowing:
				sql`COALESCE(jsonb_agg(DISTINCT to_jsonb(${foreshadowing}.*)) FILTER (WHERE ${foreshadowing.id} IS NOT NULL), '[]'::jsonb)`.as(
					"incoming_foreshadowing",
				),
		})
		.from(narrativeEvents)
		.leftJoin(questStages, sql`${narrativeEvents.questStageId} = ${questStages.id}`)
		.leftJoin(sql`${quests} AS sq`, sql`${questStages.questId} = sq.id`)
		.leftJoin(questStageDecisions, sql`${narrativeEvents.triggeringStageDecisionId} = ${questStageDecisions.id}`)
		.leftJoin(sql`${quests} AS rq`, sql`${narrativeEvents.relatedQuestId} = rq.id`)
		.leftJoin(
			foreshadowing,
			sql`${foreshadowing.targetEntityType} = 'narrative_event' AND ${foreshadowing.targetEntityId} = ${narrativeEvents.id}`,
		)
		.groupBy(narrativeEvents.id, questStages.id, sql`sq.id`, questStageDecisions.id, sql`rq.id`),
)

export const consequenceSearchDataView = pgView("consequence_search_data_view").as((qb) =>
	qb
		.select({
			id: consequences.id,
			sourceTable: sql<string>`'consequences'`.as("source_table"),
			entityMain: sql`to_jsonb(${consequences}.*)`.as("entity_main"),
			// Trigger entity relationships
			triggerQuest: sql`COALESCE(jsonb_build_object('id', tq.id, 'name', tq.name), '{}'::jsonb)`.as("trigger_quest"),
			triggerConflict: sql`COALESCE(jsonb_build_object('id', tc.id, 'name', tc.name), '{}'::jsonb)`.as(
				"trigger_conflict",
			),
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
			affectedNarrativeDestination: sql`COALESCE(jsonb_build_object('id', and_.id, 'name', and_.name), '{}'::jsonb)`.as(
				"affected_narrative_destination",
			),
			affectedConflict: sql`COALESCE(jsonb_build_object('id', ac.id, 'name', ac.name), '{}'::jsonb)`.as(
				"affected_conflict",
			),
			affectedQuest: sql`COALESCE(jsonb_build_object('id', aq.id, 'name', aq.name), '{}'::jsonb)`.as("affected_quest"),
		})
		.from(consequences)
		// Trigger entity joins
		.leftJoin(
			sql`${quests} AS tq`,
			sql`${consequences.triggerEntityType} = 'quest' AND ${consequences.triggerEntityId} = tq.id`,
		)
		.leftJoin(
			sql`${conflicts} AS tc`,
			sql`${consequences.triggerEntityType} = 'conflict' AND ${consequences.triggerEntityId} = tc.id`,
		)
		// Affected entity joins
		.leftJoin(
			sql`${factions} AS af`,
			sql`${consequences.affectedEntityType} = 'faction' AND ${consequences.affectedEntityId} = af.id`,
		)
		.leftJoin(
			sql`${regions} AS ar`,
			sql`${consequences.affectedEntityType} = 'region' AND ${consequences.affectedEntityId} = ar.id`,
		)
		.leftJoin(
			sql`${areas} AS aa`,
			sql`${consequences.affectedEntityType} = 'area' AND ${consequences.affectedEntityId} = aa.id`,
		)
		.leftJoin(
			sql`${sites} AS as_`,
			sql`${consequences.affectedEntityType} = 'site' AND ${consequences.affectedEntityId} = as_.id`,
		)
		.leftJoin(
			sql`${npcs} AS an`,
			sql`${consequences.affectedEntityType} = 'npc' AND ${consequences.affectedEntityId} = an.id`,
		)
		.leftJoin(
			sql`${narrativeDestinations} AS and_`,
			sql`${consequences.affectedEntityType} = 'narrative_destination' AND ${consequences.affectedEntityId} = and_.id`,
		)
		.leftJoin(
			sql`${conflicts} AS ac`,
			sql`${consequences.affectedEntityType} = 'conflict' AND ${consequences.affectedEntityId} = ac.id`,
		)
		.leftJoin(
			sql`${quests} AS aq`,
			sql`${consequences.affectedEntityType} = 'quest' AND ${consequences.affectedEntityId} = aq.id`,
		)
		.groupBy(
			consequences.id,
			sql`tq.id`,
			sql`tc.id`,
			sql`af.id`,
			sql`ar.id`,
			sql`aa.id`,
			sql`as_.id`,
			sql`an.id`,
			sql`and_.id`,
			sql`ac.id`,
			sql`aq.id`,
		),
)

// export const consequencesRelations = relations(consequences, ({ one }) => ({
// 	// Trigger entity soft relations (what triggered the consequence)
// 	triggerQuest: one(quests, {
// 		relationName: "ConsequenceTriggerQuest",
// 		fields: [consequences.triggerEntityId],
// 		references: [quests.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.triggerEntityType} = 'quest'`,
// 	}),

// 	triggerConflict: one(conflicts, {
// 		relationName: "ConsequenceTriggerConflict",
// 		fields: [consequences.triggerEntityId],
// 		references: [conflicts.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.triggerEntityType} = 'conflict'`,
// 	}),

// 	// Note: 'decision' type doesn't map to a specific table as it represents quest stage decisions
// 	// which are handled differently in the application layer

// 	// Affected entity soft relations (what the consequence affects)
// 	affectedFaction: one(factions, {
// 		relationName: "ConsequenceAffectedFaction",
// 		fields: [consequences.affectedEntityId],
// 		references: [factions.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'faction'`,
// 	}),

// 	affectedRegion: one(regions, {
// 		relationName: "ConsequenceAffectedRegion",
// 		fields: [consequences.affectedEntityId],
// 		references: [regions.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'region'`,
// 	}),

// 	affectedArea: one(areas, {
// 		relationName: "ConsequenceAffectedArea",
// 		fields: [consequences.affectedEntityId],
// 		references: [areas.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'area'`,
// 	}),

// 	affectedSite: one(sites, {
// 		relationName: "ConsequenceAffectedSite",
// 		fields: [consequences.affectedEntityId],
// 		references: [sites.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'site'`,
// 	}),

// 	affectedNpc: one(npcs, {
// 		relationName: "ConsequenceAffectedNpc",
// 		fields: [consequences.affectedEntityId],
// 		references: [npcs.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'npc'`,
// 	}),

// 	affectedNarrativeDestination: one(narrativeDestinations, {
// 		relationName: "ConsequenceAffectedNarrativeDestination",
// 		fields: [consequences.affectedEntityId],
// 		references: [narrativeDestinations.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'narrative_destination'`,
// 	}),

// 	affectedConflict: one(conflicts, {
// 		relationName: "ConsequenceAffectedConflict",
// 		fields: [consequences.affectedEntityId],
// 		references: [conflicts.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'conflict'`,
// 	}),

// 	affectedQuest: one(quests, {
// 		relationName: "ConsequenceAffectedQuest",
// 		fields: [consequences.affectedEntityId],
// 		references: [quests.id],
// 		// @ts-expect-error - Drizzle doesn't have proper types for where conditions in relations yet
// 		where: sql`${consequences.affectedEntityType} = 'quest'`,
// 	}),
// }))
