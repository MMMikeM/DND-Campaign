const destinationTypes = ["main", "faction", "character", "side"] as const

const destinationStatuses = ["planned", "in_progress", "completed", "abandoned"] as const
const destinationRelationshipTypes = [
	"leads_to",
	"is_prerequisite_for",
	"is_complicated_by",
	"runs_parallel_to",
] as const
const destinationImportance = ["minor", "supporting", "major", "central"] as const

const emotionalShapes = [
	"Hope_to_Triumph", // Classic Heroic arc
	"Dread_to_Relief", // Mystery/Horror resolution
	"Victory_to_Consequence", // A win that creates a new problem
	"Descent_into_Darkness", // Tragic arc
	"Struggle_to_Bittersweet_Victory", // Costly success
	"Rally_from_Defeat", // Bouncing back from an "All is Lost" moment
] as const

const narrativeRoles = ["Setup", "Progress", "Payoff", "Epilogue", "Side_Story"] as const

export const enums = {
	destinationImportance,
	destinationTypes,
	destinationRelationshipTypes,
	destinationStatuses,
	emotionalShapes,
	narrativeRoles,
}
