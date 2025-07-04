import { alignments, relationshipStrengths, wealthLevels } from "../shared-enums"

const factionSizes = ["tiny", "small", "medium", "large", "massive"] as const
const reachLevels = ["local", "regional", "national", "continental", "global"] as const
const diplomaticStatuses = ["ally", "enemy", "neutral", "vassal", "suzerain", "rival", "trade"] as const
const agendaTypes = ["economic", "military", "political", "social", "occult", "technological"] as const
const agendaStages = ["preparatory", "active", "concluding", "resolved"] as const
const agendaImportance = ["peripheral", "significant", "central"] as const
const influenceLevels = ["contested", "minor", "influenced", "moderate", "strong", "controlled", "dominated"] as const
const factionTypes = [
	"guild",
	"cult",
	"tribe",
	"noble_house",
	"mercantile",
	"religious",
	"military",
	"criminal",
	"political",
	"arcane",
] as const

const transparencyLevels = ["transparent", "secretive", "deceptive"] as const

export const enums = {
	agendaImportance,
	agendaStages,
	agendaTypes,
	alignments,
	diplomaticStatuses,
	factionSizes,
	factionTypes,
	influenceLevels,
	reachLevels,
	relationshipStrengths,
	transparencyLevels,
	wealthLevels,
}
