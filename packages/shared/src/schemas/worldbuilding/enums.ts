const conceptScopes = ["local", "regional", "continental", "world"] as const
const conceptTypes = [
	"cultural",
	"political",
	"religious",
	"natural",
	"mythic",
	"cultural_group",
	"historical_period",
	"social_institution",
] as const
const complexityProfiles = ["simple_clear", "layered_nuance", "deep_mystery"] as const
const moralClarity = ["clear_good_evil_spectrum", "contextual_grey", "inherently_ambiguous"] as const
const conceptStatuses = ["historical", "active", "emerging", "declining", "dormant"] as const

const conceptRelationshipTypes = [
	"allies",
	"rivals",
	"caused_by",
	"led_to",
	"influenced_by",
	"parallels",
	"opposes",
	"evolved_from",
	"prerequisite_for",
	"supports",
	"undermines",
] as const

const conceptLinkStrengths = ["tenuous", "moderate", "strong", "defining"] as const

export const enums = {
	complexityProfiles,
	conceptLinkStrengths,
	conceptRelationshipTypes,
	conceptScopes,
	conceptStatuses,
	conceptTypes,
	moralClarity,
}
