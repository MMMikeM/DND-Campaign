// quests/stages/tables.ts

import { sql } from "drizzle-orm"
import { boolean, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../../db/utils"
import { npcs } from "../../npcs/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { ambiguityLevels, complexityLevels, conditionTypes, decisionTypes, stageImportanceLevels, stageTypes } = enums

export const questStages = pgTable("quest_stages", {
	id: pk(),
	name: string("name").unique(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	siteId: nullableFk("site_id", sites.id),
	deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),

	questId: cascadeFk("quest_id", () => quests.id),

	stageOrder: integer("stage_order").notNull(),

	dramatic_question: string("dramatic_question"),

	stageType: oneOf("stage_type", stageTypes),
	intendedComplexityLevel: oneOf("intended_complexity_level", complexityLevels),
	stageImportance: oneOf("stage_importance", stageImportanceLevels),

	objectives: list("objectives"),
	completionPaths: list("completion_paths"),
	encounters: list("encounters"),
	dramatic_moments: list("dramatic_moments"),
	sensory_elements: list("sensory_elements"),
})

export const stageDecisions = pgTable(
	"stage_decisions",
	{
		id: pk(),
		name: string("name").unique(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", () => quests.id),
		fromStageId: cascadeFk("from_stage_id", questStages.id),

		toStageId: nullableFk("to_stage_id", questStages.id),

		conditionType: oneOf("condition_type", conditionTypes),
		decisionType: oneOf("decision_type", decisionTypes),
		ambiguityLevel: oneOf("ambiguity_level", ambiguityLevels),

		options: list("options"),
		successDescription: list("success_description"),
		failureDescription: list("failure_description"),
		narrativeTransition: list("narrative_transition"),
		potential_player_reactions: list("potential_player_reactions"),

		conditionValue: string("condition_value"),
		failure_leads_to_retry: boolean("failure_leads_to_retry").notNull().default(false),
		failure_lesson_learned: nullableString("failure_lesson_learned"),
	},
	(t) => [
		unique().on(t.questId, t.fromStageId, t.toStageId),
		check("chk_stage_decision_no_self_loop", sql`COALESCE(${t.fromStageId} != ${t.toStageId}, TRUE)`),
		check(
			"chk_failure_retry_lesson",
			sql`(${t.failure_leads_to_retry} = FALSE) OR (${t.failure_lesson_learned} IS NOT NULL)`,
		),
	],
)

export const npcStageInvolvement = pgTable(
	"npc_stage_involvement",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		npcId: cascadeFk("npc_id", npcs.id),
		questStageId: cascadeFk("quest_stage_id", questStages.id),

		roleInStage: string("role_in_stage"),

		involvementDetails: list("involvement_details"),
	},
	(t) => [unique().on(t.npcId, t.questStageId)],
)
