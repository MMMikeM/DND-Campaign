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

const questHookSourceTypes = ["site", "faction", "npc"] as const

const impactSeverity = ["minor", "moderate", "major"] as const
const eventTypes = ["complication", "escalation", "twist"] as const
const narrativePlacements = ["early", "middle", "climax", "denouement"] as const
const rhythmEffects = [
	"spike_immediate_tension",
	"introduce_new_mystery",
	"force_strategic_reassessment",
	"escalate_existing_stakes",
	"reveal_and_twist",
] as const

const consequenceTypes = [
	"character_reaction",
	"npc_status_change",
	"relationship_change",

	"faction_power_shift",
	"political_shift",
	"reputation_change",

	"region_status_change",
	"environmental_change",
	"demographic_shift",

	"resource_availability_change",
	"item_acquisition",

	"quest_availability_change",
	"story_progression",
] as const

const consequenceVisibility = ["obvious", "subtle", "hidden"] as const
const consequenceTimeframe = ["immediate", "next_session", "specific_trigger", "later_in_campaign"] as const
const consequenceSources = [
	"decision",
	"quest_completion",
	"world_event",
	"player_choice",
	"time_passage",
	"quest_completion_affecting_conflict",
] as const
const playerImpactFeels = [
	"empowering_reward",
	"earned_progress",
	"challenging_setback",
	"neutral_world_evolution",
	"unexpected_opportunity",
	"just_consequence",
] as const

const emotionalShapes = [
	"heroic_journey",
	"moral_dilemma",
	"personal_growth",
	"battle_of_wills",
	"battle_of_minds",
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
	questHookSourceTypes,
	consequenceTypes,
	consequenceVisibility,
	consequenceTimeframe,
	consequenceSources,
	playerImpactFeels,

	impactSeverity,
	eventTypes,
	narrativePlacements,
	rhythmEffects,
	emotionalShapes,
}
