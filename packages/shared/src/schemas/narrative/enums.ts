import { discoverySubtlety, narrativeWeight } from "../shared-enums"

const questRoles = ["introduction", "complication", "rising_action", "climax", "resolution", "epilogue"] as const
const arcTypes = ["main", "faction", "character", "side"] as const
const foreshadowingTypes = ["document", "conversation", "object", "environmental", "vision", "rumor"] as const
const emotionalArcs = [
	"triumph_over_adversity",
	"tragic_fall",
	"bittersweet_resolution",
	"hopeful_new_beginning",
	"cyclical_struggle",
	"moral_awakening",
	"descent_into_darkness",
	"redemption_journey",
] as const
const destinationStatuses = ["planned", "in_progress", "completed", "abandoned"] as const
const destinationRelationshipTypes = [
	"prerequisite",
	"sequel",
	"parallel",
	"alternative",
	"thematic_echo",
	"contrast",
] as const
const arcImportanceLevels = ["minor", "supporting", "major", "central"] as const

export const enums = {
	arcImportanceLevels,
	arcTypes,
	destinationRelationshipTypes,
	destinationStatuses,
	discoverySubtlety,
	emotionalArcs,
	foreshadowingTypes,
	narrativeWeight,
	questRoles,
}
