const loreTypes = [
	"cultural",
	"political",
	"religious",
	"natural",
	"mythic",
	"historical",
	"institutional",
	"philosophical",
] as const

const loreRelationshipTypes = [
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

const loreLinkStrengths = ["tenuous", "moderate", "strong", "defining"] as const
const targetEntityTypes = ["region", "faction", "npc", "conflict", "quest"] as const

export const enums = {
	loreTypes,
	loreRelationshipTypes,
	loreLinkStrengths,
	targetEntityTypes,
}
