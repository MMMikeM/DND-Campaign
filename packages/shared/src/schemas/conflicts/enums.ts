export const conflictScopes = ["local", "regional", "global"] as const
export const conflictNatures = ["political", "military", "mystical", "social", "economic", "environmental"] as const
export const conflictStatuses = ["brewing", "active", "escalating", "deescalating", "resolved"] as const
export const participantRolesInConflict = [
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
export const conflictClarity = [
	"clear_aggressor_victim",
	"competing_legitimate_grievances",
	"mutually_flawed_sides",
	"no_discernible_good_option",
] as const

export const tensionLevels = ["low", "building", "high", "breaking"] as const
