import { trustLevels } from "../shared-enums"

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencyLevels = ["background", "developing", "urgent", "critical"] as const
const visibilityLevels = ["hidden", "rumored", "known", "featured"] as const
const relationshipTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const participantImportanceLevels = ["minor", "supporting", "major", "critical"] as const
const hookTypes = ["rumor", "npc_interaction", "location_discovery"] as const
const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const
const moralSpectrumFocus = ["clear_right_wrong", "contextual_dilemma", "true_ambiguity"] as const

const pacingRoles = [
	"tension_builder",
	"release_valve",
	"investigative_slow_burn",
	"action_peak",
	"character_development_focus",
] as const
const playerExperienceGoals = [
	"heroism_clarity",
	"challenging_dilemma",
	"mystery_solving",
	"exploration_discovery",
	"social_intrigue",
	"emotional_impact",
] as const

export const enums = {
	hookTypes,
	moralSpectrumFocus,
	pacingRoles,
	participantImportanceLevels,
	playerExperienceGoals,
	presentationStyles,
	questTypes,
	relationshipTypes,
	trustLevels,
	urgencyLevels,
	visibilityLevels,
}
