import type {
	ConflictForFactionAnalysis,
	FactionAgendaForAnalysis,
	FactionDiplomacyForAnalysis,
	FactionForAnalysis,
	NarrativeParticipationForAnalysis,
	PoliticalLandscapeAnalysis,
} from "./types"

// Helper function to count occurrences using Object.groupBy
function countBy<T>(items: T[], extractor: (item: T) => string): Record<string, number> {
	const grouped = Object.groupBy(items, extractor)
	return Object.fromEntries(Object.entries(grouped).map(([key, items]) => [key, items?.length ?? 0]))
}

export function analyzePoliticalLandscape({
	existingFactions,
	existingAgendas,
	existingDiplomacy,
	activeConflicts,
	narrativeParticipation,
}: {
	existingFactions: FactionForAnalysis[]
	existingAgendas: FactionAgendaForAnalysis[]
	existingDiplomacy: FactionDiplomacyForAnalysis[]
	activeConflicts: ConflictForFactionAnalysis[]
	narrativeParticipation: NarrativeParticipationForAnalysis[]
}): PoliticalLandscapeAnalysis {
	const analysis: PoliticalLandscapeAnalysis = {
		powerVacuums: [],
		alignmentGaps: [],
		territorialOpportunities: [],
		diplomaticOpenings: [],
		narrativeIntegrationPotential: [],
	}

	// Analyze faction type distribution
	const allFactionTypes = existingFactions.flatMap((faction) => faction.type)
	const factionTypeDistribution = countBy(allFactionTypes, (type) => type)

	// Identify underrepresented faction types
	const underrepresentedTypes = [
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
	].filter((type) => (factionTypeDistribution[type] || 0) < 2)

	if (underrepresentedTypes.length > 0) {
		analysis.powerVacuums.push(`Limited representation in ${underrepresentedTypes.join(", ")} faction types`)
	}

	// Analyze alignment distribution
	const alignmentDistribution = countBy(existingFactions, (faction) => faction.publicAlignment)

	// Look for alignment gaps
	const allAlignments = [
		"lawful good",
		"neutral good",
		"chaotic good",
		"lawful neutral",
		"true neutral",
		"chaotic neutral",
		"lawful evil",
		"neutral evil",
		"chaotic evil",
	]

	const underrepresentedAlignments = allAlignments.filter((alignment) => !alignmentDistribution[alignment])

	if (underrepresentedAlignments.length > 0) {
		analysis.alignmentGaps.push(`Missing factions with ${underrepresentedAlignments.join(", ")} alignments`)
	}

	// Analyze agenda coverage
	const agendaTypes = existingAgendas.map((agenda) => agenda.agendaType)
	const agendaGaps = ["economic", "military", "political", "social", "occult", "technological"].filter(
		(type) => !agendaTypes.includes(type),
	)

	if (agendaGaps.length > 0) {
		analysis.powerVacuums.push(`No active agendas in ${agendaGaps.join(", ")} spheres`)
	}

	// Analyze diplomatic landscape
	const diplomaticNetworkSize = existingDiplomacy.length
	const factionCount = existingFactions.length
	const expectedConnections = Math.floor((factionCount * (factionCount - 1)) / 4) // Rough estimate

	if (diplomaticNetworkSize < expectedConnections) {
		analysis.diplomaticOpenings.push("Underdeveloped diplomatic network - many factions lack formal relationships")
	}

	// Check for isolated factions
	const connectedFactionIds = new Set([
		...existingDiplomacy.map((d) => d.sourceFaction.id),
		...existingDiplomacy.map((d) => d.targetFaction.id),
	])

	const isolatedFactions = existingFactions.filter((f) => !connectedFactionIds.has(f.id))

	if (isolatedFactions.length > 0) {
		analysis.diplomaticOpenings.push(`${isolatedFactions.length} factions lack formal diplomatic relationships`)
	}

	// Analyze conflict participation
	const activeConflictParticipants = new Set(
		activeConflicts.flatMap((conflict) =>
			conflict.participants.map((p) => p.faction?.id).filter((id): id is number => id !== null),
		),
	)

	const nonConflictFactions = existingFactions.filter((f) => !activeConflictParticipants.has(f.id))

	if (nonConflictFactions.length > existingFactions.length / 2) {
		analysis.narrativeIntegrationPotential.push("Many factions not involved in current conflicts")
	}

	// Analyze narrative arc participation
	const narrativeParticipants = new Set(
		narrativeParticipation.map((p) => p.faction?.id).filter((id): id is number => id !== null),
	)

	const nonNarrativeFactions = existingFactions.filter((f) => !narrativeParticipants.has(f.id))

	if (nonNarrativeFactions.length > 0) {
		analysis.narrativeIntegrationPotential.push(
			`${nonNarrativeFactions.length} factions not involved in narrative arcs`,
		)
	}

	// Territory analysis - look for geographic clustering opportunities
	const factionsWithLocations = existingFactions.filter((f) => f.primaryHqSite?.area)
	const locationCoverage = factionsWithLocations.map((f) => f.primaryHqSite?.area?.name).filter(Boolean)

	if (locationCoverage.length < existingFactions.length) {
		analysis.territorialOpportunities.push("Some regions may lack major faction presence")
	}

	return analysis
}
