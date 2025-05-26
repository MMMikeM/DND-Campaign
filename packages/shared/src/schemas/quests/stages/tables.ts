// quests/stages/tables.ts
import { boolean, integer, pgTable, unique } from "drizzle-orm/pg-core"
import { cascadeFk, list, nullableFk, oneOf, pk, string } from "../../../db/utils"
import { embeddings } from "../../embeddings/tables"
import { sites } from "../../regions/tables"
import { quests } from "../tables"

const decisionTypes = [
	"moral_choice",
	"tactical_decision",
	"resource_allocation",
	"trust_test",
	"sacrifice_opportunity",
	"identity_question",
] as const

const conditionTypes = [
	"choice",
	"skill_check",
	"item",
	"npc_relation",
	"faction",
	"time",
	"combat",
	"custom_event",
] as const

const stageTypes = [
	"revelation_point",
	"decision_point",
	"consequence_point",
	"character_point",
	"simple_challenge_point",
	"rest_interaction_point",
	"setup_foreshadowing",
] as const
const ambiguityLevels = [
	"clear_best_option_obvious_tradeoff",
	"balanced_valid_options",
	"truly_ambiguous_no_clear_right",
] as const
const stageImportanceLevels = ["minor_step", "standard", "major_point", "climax_point"] as const
const complexityLevels = ["low_complexity_breather", "medium_complexity_standard", "high_complexity_peak"] as const

export const questStages = pgTable("quest_stages", {
	id: pk(),
	creativePrompts: list("creative_prompts"),
	description: list("description"),
	gmNotes: list("gm_notes"),
	tags: list("tags"),

	questId: cascadeFk("quest_id", quests.id),
	siteId: nullableFk("site_id", sites.id),
	// Renamed for clarity about branching vs linear progression
	stageOrder: integer("stage_order").notNull(), // Typical sequence, not strict linear progression
	name: string("name").unique(),
	dramatic_question: string("dramatic_question"),

	stageType: oneOf("stage_type", stageTypes),
	intendedComplexityLevel: oneOf("intended_complexity_level", complexityLevels),

	objectives: list("objectives"),
	completionPaths: list("completion_paths"),
	encounters: list("encounters"),
	dramatic_moments: list("dramatic_moments"),
	sensory_elements: list("sensory_elements"),

	stageImportance: oneOf("stage_importance", stageImportanceLevels).default("standard"),

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

		questId: cascadeFk("quest_id", quests.id),
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

		// Try/Fail support
		failure_leads_to_retry: boolean("failure_leads_to_retry").default(false),
		failure_lesson_learned: string("failure_lesson_learned"),
	},
	(t) => [unique().on(t.questId, t.fromStageId, t.toStageId)],
)

export const enums = {
	decisionTypes,
	conditionTypes,
	stageTypes,
	ambiguityLevels,
	stageImportanceLevels,
	complexityLevels,
}
