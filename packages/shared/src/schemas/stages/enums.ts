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

export const enums = {
	ambiguityLevels,
	complexityLevels,
	conditionTypes,
	decisionTypes,
	stageImportanceLevels,
	stageTypes,
}
