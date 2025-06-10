// quests/stages/tables.ts

import { sql } from "drizzle-orm"
import { boolean, check, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, nullableString, oneOf, pk, string } from "../../../db/utils"
import { embeddings } from "../../embeddings/tables"
import { npcs } from "../../npc/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"
import { enums } from "./enums"

export { enums } from "./enums"

const { ambiguityLevels, complexityLevels, conditionTypes, decisionTypes, stageImportanceLevels, stageTypes } = enums

export const questStages = pgTable("quest_stages", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	questId: cascadeFk("quest_id", () => quests.id),
	siteId: nullableFk("site_id", sites.id),
	deliveryNpcId: nullableFk("delivery_npc_id", npcs.id),
	stageOrder: integer("stage_order").notNull(),
	name: string("name").unique(),
	dramatic_question: string("dramatic_question"),

	stageType: oneOf("stage_type", stageTypes),
	intendedComplexityLevel: oneOf("intended_complexity_level", complexityLevels),

	objectives: list("objectives"),
	completionPaths: list("completion_paths"),
	encounters: list("encounters"),
	dramatic_moments: list("dramatic_moments"),
	sensory_elements: list("sensory_elements"),

	stageImportance: oneOf("stage_importance", stageImportanceLevels),

	embeddingId: nullableFk("embedding_id", embeddings.id),
})

export const stageDecisions = pgTable(
	"stage_decisions",
	{
		id: pk(),
		creativePrompts: list("creative_prompts"),
		description: list("description"),
		gmNotes: list("gm_notes"),
		tags: list("tags"),

		questId: cascadeFk("quest_id", () => {
			const { quests } = require("../tables")
			return quests.id
		}),
		fromStageId: cascadeFk("from_stage_id", questStages.id),
		toStageId: nullableFk("to_stage_id", questStages.id),
		conditionType: oneOf("condition_type", conditionTypes),
		decisionType: oneOf("decision_type", decisionTypes),
		name: string("name"),

		ambiguityLevel: oneOf("ambiguity_level", ambiguityLevels),
		conditionValue: string("condition_value"),
		successDescription: list("success_description"),
		failureDescription: list("failure_description"),
		narrativeTransition: list("narrative_transition"),
		potential_player_reactions: list("potential_player_reactions"),
		options: list("options"),

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
		isOptional: boolean("is_optional").notNull().default(false),
	},
	(t) => [unique().on(t.npcId, t.questStageId)],
)
