export { trustLevels, impactSeverity } from "../shared-enums"

export const questTypes = ["main", "side", "faction", "character", "generic"] as const
export const urgencyLevels = ["background", "developing", "urgent", "critical"] as const
export const questRelationshipTypes = [
	"prerequisite",
	"sequel",
	"parallel",
	"alternative",
	"hidden_connection",
] as const
export const participantImportanceLevels = ["minor", "supporting", "major", "critical"] as const
export const hookTypes = ["rumor", "npc_interaction", "location_discovery"] as const
export const presentationStyles = ["subtle", "clear", "urgent", "mysterious"] as const

export const questHookSourceTypes = ["site", "faction", "npc"] as const

export const eventTypes = ["complication", "escalation", "twist"] as const
export const narrativePlacements = ["early", "middle", "climax", "denouement"] as const
export const rhythmEffects = [
	"spike_immediate_tension",
	"introduce_new_mystery",
	"force_strategic_reassessment",
	"escalate_existing_stakes",
	"reveal_and_twist",
] as const

export const emotionalShapes = [
	"heroic_journey",
	"moral_dilemma",
	"personal_growth",
	"battle_of_wills",
	"battle_of_minds",
] as const
