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

export const consequenceTriggerTypes = ["decision", "quest", "conflict"] as const
export const consequenceAffectedEntityTypes = [
	"faction",
	"region",
	"area",
	"site",
	"npc",
	"narrative_destination",
	"conflict",
	"quest",
] as const

export const enums = {
	consequenceSources,
	consequenceTimeframe,
	consequenceTypes,
	consequenceVisibility,
	eventTypes,
	impactSeverity,
	narrativePlacements,
	playerImpactFeels,
	rhythmEffects,
	consequenceTriggerTypes,
	consequenceAffectedEntityTypes,
}
