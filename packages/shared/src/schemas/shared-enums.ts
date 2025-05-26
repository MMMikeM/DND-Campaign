// shared-enums.ts
// This file contains ONLY enums that are shared between multiple table files.
// Single-use enums should be defined directly in their respective table files.

export const alignments = [
	"lawful good",
	"neutral good",
	"chaotic good",
	"lawful neutral",
	"true neutral",
	"chaotic neutral",
	"lawful evil",
	"neutral evil",
	"chaotic evil",
] as const

export const wealthLevels = ["destitute", "poor", "moderate", "rich", "wealthy"] as const

export const relationshipStrengths = [
	"weak",
	"moderate",
	"friendly",
	"strong",
	"unbreakable",
	"friction",
	"cold",
	"hostile",
	"war",
] as const

export const discoverySubtlety = ["obvious", "moderate", "subtle", "hidden"] as const

export const narrativeWeight = ["minor", "supporting", "major", "crucial"] as const

export const trustLevels = ["none", "low", "medium", "high"] as const
