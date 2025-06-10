import type {
	CampaignAnalysis,
	ConflictForAnalysis,
	FactionForAnalysis,
	NarrativeArcForAnalysis,
	NPCForAnalysis,
	QuestForAnalysis,
} from "./types"

// Helper function to count occurrences using Object.groupBy
function countBy<T>(items: T[], extractor: (item: T) => string): Record<string, number> {
	const grouped = Object.groupBy(items, extractor)
	return Object.fromEntries(Object.entries(grouped).map(([key, items]) => [key, items?.length ?? 0]))
}

export function analyzeCampaignContext(
	existingNPCs: NPCForAnalysis[],
	factions: FactionForAnalysis[],
	activeConflicts: ConflictForAnalysis[],
	quests: QuestForAnalysis[],
	narrativeArcs: NarrativeArcForAnalysis[],
): CampaignAnalysis {
	const analysis: CampaignAnalysis = {
		complexityGaps: [],
		playerPerceptionGaps: [],
		factionRepresentationGaps: [],
		narrativeIntegrationOpportunities: [],
	}

	// Analyze NPC complexity distribution
	const complexityDistribution = countBy(existingNPCs, (npc) => npc.complexityProfile)

	const underrepresentedComplexity = [
		"moral_anchor_good",
		"moral_anchor_evil",
		"contextual_flawed_understandable",
		"deeply_complex_contradictory",
		"simple_what_you_see",
	].filter((type) => (complexityDistribution[type] || 0) < 2)

	if (underrepresentedComplexity.length > 0) {
		analysis.complexityGaps = underrepresentedComplexity.map(
			(type) => `${type.replace(/_/g, " ")} NPCs needed for campaign balance`,
		)
	}

	// Analyze player perception goals
	const perceptionDistribution = countBy(existingNPCs, (npc) => npc.playerPerceptionGoal)

	if ((perceptionDistribution.comic_relief_levity || 0) < 2) {
		analysis.playerPerceptionGaps.push("Campaign needs more comic relief characters")
	}
	if ((perceptionDistribution.tragic_figure_empathy || 0) < 1) {
		analysis.playerPerceptionGaps.push("Campaign lacks tragic figures for emotional depth")
	}

	// Analyze faction representation
	const factionMemberCounts = factions.map((faction) => {
		const memberCount = existingNPCs.filter((npc) => npc.relatedFactions.some((f) => f.loyalty !== "none")).length
		return { faction: faction.name, memberCount, id: faction.id }
	})

	const underrepresentedFactions = factionMemberCounts.filter((f) => f.memberCount < 2)
	if (underrepresentedFactions.length > 0) {
		analysis.factionRepresentationGaps = underrepresentedFactions.map(
			(f) => `${f.faction} needs more NPC representation (${f.memberCount} current members)`,
		)
	}

	// Analyze narrative integration opportunities
	const narrativeActiveNPCs = new Set([
		...quests.flatMap((q) =>
			q.participantInvolvement
				.filter((p) => p.npc)
				.map((p) => p.npc?.id)
				.filter(Boolean),
		),
		...narrativeArcs.flatMap((arc) =>
			arc.participantInvolvement
				.filter((p) => p.npc)
				.map((p) => p.npc?.id)
				.filter(Boolean),
		),
		...activeConflicts.flatMap((c) =>
			c.participants
				.filter((p) => p.npc)
				.map((p) => p.npc?.id)
				.filter(Boolean),
		),
	])

	const inactiveNPCs = existingNPCs.filter((npc) => !narrativeActiveNPCs.has(npc.id))
	if (inactiveNPCs.length > 5) {
		analysis.narrativeIntegrationOpportunities.push(
			`${inactiveNPCs.length} NPCs not involved in active storylines - integration opportunities`,
		)
	}

	return analysis
}
