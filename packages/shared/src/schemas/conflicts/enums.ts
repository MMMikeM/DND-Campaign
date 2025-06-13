const conflictScopes = ["local", "regional", "global"] as const
const conflictNatures = ["political", "military", "mystical", "social", "economic", "environmental"] as const
const conflictStatuses = ["brewing", "active", "escalating", "deescalating", "resolved"] as const
const participantRolesInConflict = [
	"instigator",
	"opponent",
	"ally",
	"neutral",
	"mediator",
	"beneficiary",
	"leader",
	"key_figure",
	"victim",
	"opportunist",
	"saboteur",
] as const
const questImpacts = ["escalates", "deescalates", "reveals_truth", "changes_sides", "no_change"] as const
const conflictClarity = [
	"clear_aggressor_victim",
	"competing_legitimate_grievances",
	"mutually_flawed_sides",
	"no_discernible_good_option",
] as const

const tensionLevels = ["low", "building", "high", "breaking"] as const

export const enums = {
	conflictClarity,
	conflictNatures,
	conflictScopes,
	conflictStatuses,
	participantRolesInConflict,
	questImpacts,
	tensionLevels,
}
