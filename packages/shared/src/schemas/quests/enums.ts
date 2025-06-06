import { trustLevels } from "../shared-enums"

const questTypes = ["main", "side", "faction", "character", "generic"] as const
const urgencyLevels = ["background", "developing", "urgent", "critical"] as const
const visibilityLevels = ["hidden", "rumored", "known", "featured"] as const
const relationshipTypes = ["prerequisite", "sequel", "parallel", "alternative", "hidden_connection"] as const
const unlockImportanceLevels = ["critical", "recommended", "optional"] as const
const participantImportanceLevels = ["minor", "supporting", "major", "critical"] as const
const hookTypes = ["rumor", "npc_interaction", "location_discovery"] as const
const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const
const npcRoles = ["quest_giver", "ally", "antagonist", "guide", "bystander", "target", "victim", "resource"] as const
const factionRoles = ["quest_giver", "antagonist", "ally", "target", "beneficiary", "obstacle", "resource"] as const
const moralSpectrumFocus = ["clear_right_wrong", "contextual_dilemma", "true_ambiguity"] as const
const unlockConditionTypes = [
	"item_possession",
	"party_member",
	"prior_decision",
	"faction_reputation",
	"character_attribute",
	"skill_threshold",
	"quest_outcome",
] as const
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
	factionRoles,
	hookTypes,
	moralSpectrumFocus,
	npcRoles,
	pacingRoles,
	participantImportanceLevels,
	playerExperienceGoals,
	presentationStyles,
	questTypes,
	relationshipTypes,
	trustLevels,
	unlockConditionTypes,
	unlockImportanceLevels,
	urgencyLevels,
	visibilityLevels,
}
