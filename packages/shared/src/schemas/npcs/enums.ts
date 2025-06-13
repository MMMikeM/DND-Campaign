import { alignments, relationshipStrengths, trustLevels, wealthLevels } from "../shared-enums"

const genders = ["male", "female", "non-humanoid"] as const
const relationshipTypes = ["ally", "enemy", "family", "rival", "mentor", "student", "friend", "contact"] as const
const adaptabilityLevels = ["rigid", "reluctant", "flexible", "opportunistic"] as const
const npcFactionRoles = [
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
const races = [
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

const cprScores = ["low", "medium", "high"] as const

const characterComplexityProfiles = [
	"moral_anchor_good",
	"moral_anchor_evil",
	"contextual_flawed_understandable",
	"deeply_complex_contradictory",
	"simple_what_you_see",
] as const

const playerPerceptionGoals = [
	"trustworthy_ally_anchor",
	"clear_villain_foil",
	"intriguing_mystery_figure",
	"comic_relief_levity",
	"tragic_figure_empathy",
	"relatable_everyman",
] as const

const npcStatuses = ["alive", "dead", "missing", "imprisoned", "exiled", "unknown"] as const
const availabilityLevels = ["always", "often", "sometimes", "rarely", "unavailable"] as const

const siteAssociationTypes = [
	"residence",
	"workplace",
	"frequent_visitor",
	"secret_meeting_spot",
	"hideout",
	"place_of_power",
	"sentimental_location",
] as const

export const enums = {
	adaptabilityLevels,
	alignments,
	availabilityLevels,
	characterComplexityProfiles,
	cprScores,
	genders,
	npcFactionRoles,
	npcStatuses,
	playerPerceptionGoals,
	races,
	relationshipStrengths,
	relationshipTypes,
	siteAssociationTypes,
	trustLevels,
	wealthLevels,
}
