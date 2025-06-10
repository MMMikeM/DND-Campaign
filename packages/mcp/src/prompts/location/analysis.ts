import { tables } from "@tome-master/shared"
import { fuzzy } from "fast-fuzzy"
import type { LocationLandscapeAnalysis } from "./types"

const {
	enums: { siteTypes, secretTypes, siteFunctions, objectiveTypes },
} = tables.regionTables
const {
	enums: { stageTypes },
} = tables.questTables

// Helper function to count occurrences of types
function countTypes<T>(items: T[], extractor: (item: T) => string): Record<string, number> {
	return items.reduce(
		(acc, item) => {
			const type = extractor(item)
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)
}

// Helper function to find gaps between expected and existing types
function findTypeGaps(expectedTypes: readonly string[], existingCounts: Record<string, number>): string[] {
	return expectedTypes.filter((type) => !existingCounts[type])
}

// Analyze site and encounter type distributions
function analyzeContentGaps(data: {
	existingSites: Array<{ type: string; intendedSiteFunction: string }>
	existingEncounters: Array<{ objectiveType: string }>
	existingSecrets: Array<{ secretType: string }>
}) {
	const siteTypeCounts = countTypes(data.existingSites, (s) => s.type)
	const siteFunctionCounts = countTypes(data.existingSites, (s) => s.intendedSiteFunction)
	const encounterTypeCounts = countTypes(data.existingEncounters, (e) => e.objectiveType)
	const secretTypeCounts = countTypes(data.existingSecrets, (s) => s.secretType)

	return {
		siteTypeGaps: findTypeGaps(siteTypes, siteTypeCounts),
		encounterTypeGaps: findTypeGaps(objectiveTypes, encounterTypeCounts),
		secretTypeGaps: findTypeGaps(secretTypes, secretTypeCounts),
		functionGaps: findTypeGaps(siteFunctions, siteFunctionCounts),
	}
}

// Analyze territorial control patterns
function analyzeTerritorialOpportunities(
	factionInfluence: Array<{
		influenceLevel: string
		region: { name: string } | null
	}>,
): string[] {
	const opportunities: string[] = []
	const influenceByLevel = countTypes(factionInfluence, (fi) => fi.influenceLevel)

	if ((influenceByLevel.contested ?? 0) > 3) {
		opportunities.push("High number of contested territories - opportunity for strategic positioning")
	}

	if ((influenceByLevel.controlled ?? 0) < 5) {
		opportunities.push("Few controlled territories - opportunity for new faction stronghold")
	}

	const influencedRegions = new Set(factionInfluence.filter((fi) => fi.region).map((fi) => fi.region?.name))
	if (influencedRegions.size < 3) {
		opportunities.push("Limited regional influence spread - opportunity for expansion")
	}

	return opportunities
}

// Analyze narrative positioning opportunities
function analyzeNarrativePositioning(
	questStages: Array<{
		stageType: string
		stageImportance: string
	}>,
): string[] {
	const positioning: string[] = []
	const stageTypeCounts = countTypes(questStages, (qs) => qs.stageType)
	const missingStageTypes = findTypeGaps(stageTypes, stageTypeCounts)

	if (missingStageTypes.length > 0) {
		positioning.push(`Missing quest stage types: ${missingStageTypes.join(", ")} - opportunity for narrative diversity`)
	}

	const climaxStages = questStages.filter((qs) => qs.stageImportance === "climax_point").length
	const setupStages = questStages.filter((qs) => qs.stageImportance === "minor_step").length

	if (climaxStages > setupStages * 2) {
		positioning.push("Too many climax stages - opportunity for buildup location")
	} else if (setupStages > climaxStages * 3) {
		positioning.push("Too many setup stages - opportunity for dramatic climax location")
	}

	return positioning
}

// Analyze conflict integration opportunities
function analyzeConflictIntegration(
	activeConflicts: Array<{
		name: string
		participants: Array<{ faction: { name: string } | null; npc: { name: string } | null }>
	}>,
	questStages: Array<{ site: { name: string } | null }>,
): string[] {
	if (activeConflicts.length === 0) return []

	const integration: string[] = []

	// Find conflicts with multiple participants
	const participantCounts = countTypes(
		activeConflicts.flatMap((conflict) =>
			conflict.participants.map((p) => p.faction?.name || p.npc?.name).filter((name): name is string => Boolean(name)),
		),
		(name) => name,
	)

	const dominantParticipants = Object.entries(participantCounts)
		.filter(([_, count]) => count > 1)
		.map(([name]) => name)

	if (dominantParticipants.length > 0) {
		integration.push(
			`Multiple conflicts involve: ${dominantParticipants.join(", ")} - opportunity for convergence location`,
		)
	}

	// Find conflicts without geographical representation
	const conflictSites = questStages.map((qs) => qs.site?.name).filter((name): name is string => Boolean(name))

	const unrepresentedConflicts = activeConflicts.filter(
		(conflict) => !conflictSites.some((site) => fuzzy(conflict.name, site) > 0.1),
	)

	if (unrepresentedConflicts.length > 0) {
		integration.push(`Conflicts without dedicated locations: ${unrepresentedConflicts.map((c) => c.name).join(", ")}`)
	}

	return integration
}

export function analyzeLocationLandscape({
	existingSites,
	existingEncounters,
	existingSecrets,
	factionInfluence,
	questStages,
	activeConflicts,
}: {
	existingSites: Array<{
		id: number
		name: string
		type: string
		intendedSiteFunction: string
		encounters: Array<{ objectiveType: string; encounterCategory: string }>
		secrets: Array<{ secretType: string }>
	}>
	existingEncounters: Array<{ objectiveType: string; encounterCategory: string }>
	existingSecrets: Array<{ secretType: string }>
	factionInfluence: Array<{
		influenceLevel: string
		faction: { id: number; name: string }
		site: { id: number; name: string } | null
		area: { id: number; name: string } | null
		region: { id: number; name: string } | null
	}>
	questStages: Array<{
		stageType: string
		stageImportance: string
		site: { id: number; name: string; type: string } | null
	}>
	activeConflicts: Array<{
		name: string
		participants: Array<{ faction: { id: number; name: string } | null; npc: { id: number; name: string } | null }>
	}>
}): LocationLandscapeAnalysis {
	const contentGaps = analyzeContentGaps({ existingSites, existingEncounters, existingSecrets })
	const territorialOpportunities = analyzeTerritorialOpportunities(factionInfluence)
	const narrativePositioning = analyzeNarrativePositioning(questStages)
	const conflictIntegration = analyzeConflictIntegration(activeConflicts, questStages)

	return {
		...contentGaps,
		territorialOpportunities,
		narrativePositioning,
		conflictIntegration,
	}
}
