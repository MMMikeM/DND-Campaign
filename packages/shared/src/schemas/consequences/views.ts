import { eq, sql } from "drizzle-orm"
import { alias, pgView } from "drizzle-orm/pg-core"
import { conflicts } from "../conflicts/tables"
import { factions } from "../factions/tables"
import { npcs } from "../npcs/tables"
import { quests } from "../quests/tables"
import { areas, regions, sites } from "../regions/tables"
import { questStageDecisions } from "../stages/tables"
import { entityJsonWhen } from "../view-utils"
import { consequences } from "./tables"

// Every join here is many-to-one from consequences, so there is no aggregation.
// Tables that are both a trigger and an affected entity need an alias per role.
const triggerQuest = alias(quests, "trigger_quest")
const affectedQuest = alias(quests, "affected_quest")
const affectedConsequence = alias(consequences, "affected_consequence")

export const consequenceSearchDataView = pgView("consequence_search_data_view").as((qb) =>
	qb
		.select({
			id: consequences.id,
			sourceTable: sql<string>`'consequences'`.as("source_table"),
			entityMain: sql`to_jsonb(${consequences}.*)`.as("entity_main"),
			triggerQuest: entityJsonWhen(consequences.triggerQuestId, triggerQuest).as("trigger_quest"),
			triggerQuestStageDecision: entityJsonWhen(consequences.triggerQuestStageDecisionId, questStageDecisions).as(
				"trigger_quest_stage_decision",
			),
			affectedFaction: entityJsonWhen(consequences.affectedFactionId, factions).as("affected_faction"),
			affectedRegion: entityJsonWhen(consequences.affectedRegionId, regions).as("affected_region"),
			affectedArea: entityJsonWhen(consequences.affectedAreaId, areas).as("affected_area"),
			affectedSite: entityJsonWhen(consequences.affectedSiteId, sites).as("affected_site"),
			affectedNpc: entityJsonWhen(consequences.affectedNpcId, npcs).as("affected_npc"),
			affectedConsequence: entityJsonWhen(consequences.affectedConsequenceId, affectedConsequence).as(
				"affected_consequence",
			),
			affectedConflict: entityJsonWhen(consequences.affectedConflictId, conflicts).as("affected_conflict"),
			affectedQuest: entityJsonWhen(consequences.affectedQuestId, affectedQuest).as("affected_quest"),
		})
		.from(consequences)
		.leftJoin(triggerQuest, eq(consequences.triggerQuestId, triggerQuest.id))
		.leftJoin(questStageDecisions, eq(consequences.triggerQuestStageDecisionId, questStageDecisions.id))
		.leftJoin(factions, eq(consequences.affectedFactionId, factions.id))
		.leftJoin(regions, eq(consequences.affectedRegionId, regions.id))
		.leftJoin(areas, eq(consequences.affectedAreaId, areas.id))
		.leftJoin(sites, eq(consequences.affectedSiteId, sites.id))
		.leftJoin(npcs, eq(consequences.affectedNpcId, npcs.id))
		.leftJoin(affectedConsequence, eq(consequences.affectedConsequenceId, affectedConsequence.id))
		.leftJoin(conflicts, eq(consequences.affectedConflictId, conflicts.id))
		.leftJoin(affectedQuest, eq(consequences.affectedQuestId, affectedQuest.id)),
)
