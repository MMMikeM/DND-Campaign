import type { LocationLandscapeAnalysis } from "./types"

export function analyzeLocationLandscape({
	existingSites,
	existingEncounters,
	existingSecrets,
	factionInfluence,
	questStages,
	activeConflicts,
}: {
	existingSites: {
		id: number
		name: string
		type: string
		intendedSiteFunction: string
		encounters: { objectiveType: string; encounterCategory: string }[]
		secrets: { secretType: string }[]
	}[]
	existingEncounters: { objectiveType: string; encounterCategory: string }[]
	existingSecrets: { secretType: string }[]
	factionInfluence: {
		influenceLevel: string
		faction: { id: number; name: string }
		site: { id: number; name: string } | null
		area: { id: number; name: string } | null
		region: { id: number; name: string } | null
	}[]
	questStages: { stageType: string; stageImportance: string; site: { id: number; name: string; type: string } | null }[]
	activeConflicts: {
		name: string
		participants: { faction: { id: number; name: string } | null; npc: { id: number; name: string } | null }[]
	}[]
}): LocationLandscapeAnalysis {
	// Analyze site type distribution
	const siteTypes = existingSites.map((s) => s.type)
	const siteTypeCounts = siteTypes.reduce(
		(acc, type) => {
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	// Define comprehensive site types that might be missing
	const expectedSiteTypes = [
		"building",
		"fortress",
		"castle",
		"tower",
		"temple",
		"market",
		"town_square",
		"port",
		"graveyard",
		"arena",
		"warehouse",
		"slum",
		"farm",
		"cave",
		"clearing",
		"beach",
		"river_crossing",
		"waterfall",
		"mountain_pass",
		"cliff",
		"oasis",
		"field",
		"grove",
		"ruins",
		"cemetery",
		"mine",
		"road",
		"bridge",
		"camp",
		"crossroads",
		"trail",
	]

	const siteTypeGaps = expectedSiteTypes.filter((type) => !siteTypeCounts[type])

	// Analyze encounter type distribution
	const encounterTypes = existingEncounters.map((e) => e.objectiveType)
	const encounterTypeCounts = encounterTypes.reduce(
		(acc, type) => {
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const expectedEncounterTypes = [
		"DEATHMATCH",
		"STOP_THE_RITUAL",
		"DARING_ESCAPE",
		"HOLD_THE_FORT",
		"SAVE_THE_NPC",
		"SABOTAGE",
		"ESCORT_PAYLOAD",
		"HEIST",
		"PEACEMAKER",
		"ARREST",
		"SURVIVE_WAVES",
		"PUZZLE_CHALLENGE",
		"SOCIAL_ENCOUNTER_WITH_STAKES",
	]

	const encounterTypeGaps = expectedEncounterTypes.filter((type) => !encounterTypeCounts[type])

	// Analyze secret type distribution
	const secretTypes = existingSecrets.map((s) => s.secretType)
	const secretTypeCounts = secretTypes.reduce(
		(acc, type) => {
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const expectedSecretTypes = ["historical", "hidden area", "concealed item", "true purpose", "connection"]
	const secretTypeGaps = expectedSecretTypes.filter((type) => !secretTypeCounts[type])

	// Analyze site function distribution
	const siteFunctions = existingSites.map((s) => s.intendedSiteFunction)
	const siteFunctionCounts = siteFunctions.reduce(
		(acc, func) => {
			acc[func] = (acc[func] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const expectedSiteFunctions = [
		"rest_stop_recovery",
		"challenge_hub_obstacle",
		"information_node_lore",
		"thematic_showcase_mood",
		"social_interaction_nexus",
	]

	const functionGaps = expectedSiteFunctions.filter((func) => !siteFunctionCounts[func])

	// Analyze territorial opportunities
	const territorialOpportunities: string[] = []

	// Look for faction influence patterns
	const factionInfluenceByLevel = factionInfluence.reduce(
		(acc, influence) => {
			acc[influence.influenceLevel] = (acc[influence.influenceLevel] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	if ((factionInfluenceByLevel.contested ?? 0) > 3) {
		territorialOpportunities.push("High number of contested territories - opportunity for strategic positioning")
	}

	if ((factionInfluenceByLevel.controlled ?? 0) < 5) {
		territorialOpportunities.push("Few controlled territories - opportunity for new faction stronghold")
	}

	// Look for geographical gaps
	const influencedRegions = new Set(factionInfluence.filter((fi) => fi.region).map((fi) => fi.region?.name))
	if (influencedRegions.size < 3) {
		territorialOpportunities.push("Limited regional influence spread - opportunity for expansion")
	}

	// Analyze narrative positioning opportunities
	const narrativePositioning: string[] = []

	// Check quest stage distribution
	const questStageTypes = questStages.map((qs) => qs.stageType)
	const stageTypeCounts = questStageTypes.reduce(
		(acc, type) => {
			acc[type] = (acc[type] || 0) + 1
			return acc
		},
		{} as Record<string, number>,
	)

	const expectedStageTypes = [
		"revelation_point",
		"decision_point",
		"consequence_point",
		"character_point",
		"simple_challenge_point",
		"rest_interaction_point",
		"setup_foreshadowing",
	]

	const missingStageTypes = expectedStageTypes.filter((type) => !stageTypeCounts[type])
	if (missingStageTypes.length > 0) {
		narrativePositioning.push(
			`Missing quest stage types: ${missingStageTypes.join(", ")} - opportunity for narrative diversity`,
		)
	}

	// Look for climax vs setup distribution
	const climaxStages = questStages.filter((qs) => qs.stageImportance === "climax_point").length
	const setupStages = questStages.filter((qs) => qs.stageImportance === "minor_step").length

	if (climaxStages > setupStages * 2) {
		narrativePositioning.push("Too many climax stages - opportunity for buildup location")
	} else if (setupStages > climaxStages * 3) {
		narrativePositioning.push("Too many setup stages - opportunity for dramatic climax location")
	}

	// Analyze conflict integration opportunities
	const conflictIntegration: string[] = []

	if (activeConflicts.length > 0) {
		const conflictParticipants = activeConflicts.flatMap((conflict) =>
			conflict.participants.map((p) => p.faction?.name || p.npc?.name).filter((name): name is string => Boolean(name)),
		)

		const participantCounts = conflictParticipants.reduce(
			(acc, name) => {
				acc[name] = (acc[name] || 0) + 1
				return acc
			},
			{} as Record<string, number>,
		)

		const dominantParticipants = Object.entries(participantCounts)
			.filter(([_, count]) => count > 1)
			.map(([name]) => name)

		if (dominantParticipants.length > 0) {
			conflictIntegration.push(
				`Multiple conflicts involve: ${dominantParticipants.join(", ")} - opportunity for convergence location`,
			)
		}

		// Look for conflicts without geographical representation
		const conflictSites = questStages
			.filter((qs) => qs.site)
			.map((qs) => qs.site?.name)
			.filter((name): name is string => Boolean(name))
		const unrepresentedConflicts = activeConflicts.filter(
			(conflict) => !conflictSites.some((site) => site.includes(conflict.name.split(" ")[0])),
		)

		if (unrepresentedConflicts.length > 0) {
			conflictIntegration.push(
				`Conflicts without dedicated locations: ${unrepresentedConflicts.map((c) => c.name).join(", ")}`,
			)
		}
	}

	return {
		siteTypeGaps: siteTypeGaps.slice(0, 8), // Limit to most relevant gaps
		encounterTypeGaps: encounterTypeGaps.slice(0, 6),
		secretTypeGaps,
		functionGaps,
		territorialOpportunities,
		narrativePositioning,
		conflictIntegration,
	}
}
