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

const linkStrengths = ["tenuous", "moderate", "strong", "defining"] as const

export const enums = {
	loreTypes,
	linkStrengths,
}
