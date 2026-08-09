export { alignments, wealthLevels, trustLevels } from "../shared-enums"

export const genders = ["male", "female", "non-humanoid"] as const
export const adaptabilityLevels = ["rigid", "reluctant", "flexible", "opportunistic"] as const
export const npcFactionRoles = [
	"leader",
	"lieutenant",
	"advisor",
	"enforcer",
	"agent",
	"member",
	"recruit",
	"elder",
	"spy",
	"figurehead",
	"financier",
	"deserter",
	"traitor",
	"exile",
] as const
export const races = [
	"human",
	"elf",
	"dwarf",
	"halfling",
	"gnome",
	"half-elf",
	"half-orc",
	"tiefling",
	"dragonborn",
	"other",
] as const

export const cprScores = ["low", "medium", "high"] as const

export const characterComplexityProfiles = [
	"moral_anchor_good",
	"moral_anchor_evil",
	"contextual_flawed_understandable",
	"deeply_complex_contradictory",
	"simple_what_you_see",
] as const

export const availabilityLevels = ["always", "often", "sometimes", "rarely", "unavailable"] as const
