import type { CampaignAnalysis, EnhancedNpcCreationArgs, RegionalContext, RelationshipSuggestions } from "./types"

interface NPCForSuggestions {
	id: number
	name: string
	occupation: string
	alignment: string
	relatedFactions: Array<{ faction: { name: string }; role: string }>
}

interface FactionForSuggestions {
	id: number
	name: string
	type: string[]
}

export function generateNPCCreationSuggestions({
	args,
	existingNPCs,
	factions,
	regionalContext,
	campaignAnalysis,
}: {
	args: EnhancedNpcCreationArgs
	existingNPCs: NPCForSuggestions[]
	factions: FactionForSuggestions[]
	regionalContext: RegionalContext | null
	campaignAnalysis: CampaignAnalysis
}): RelationshipSuggestions {
	const suggestions: RelationshipSuggestions = {
		targetNPCs: [],
		factionOpportunities: [],
		narrativeHooks: [],
		characterComplexity: [],
	}

	// Regional relationship suggestions
	if (regionalContext?.regionalNPCs) {
		const regionalCandidates = regionalContext.regionalNPCs
		regionalCandidates.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: { id: npc.id, name: npc.name, occupation: npc.occupation },
				suggestedRelationshipTypes: ["ally", "rival", "contact", "friend"],
				reasoning: `Regional connection - both operate in the same area`,
			})
		})
	}

	// Suggest faction affiliations based on hints and gaps
	if (args.faction_hint) {
		const matchingFactions = factions.filter(
			(f) =>
				f.name.toLowerCase().includes(args.faction_hint?.toLowerCase() || "") ||
				f.type.some((t) => t.toLowerCase().includes(args.faction_hint?.toLowerCase() || "")),
		)
		matchingFactions.forEach((faction) => {
			suggestions.factionOpportunities.push({
				faction: faction.name,
				role: args.role_hint || "member",
				reasoning: `Matches faction hint: ${args.faction_hint}`,
			})
		})
	}

	// Fill faction representation gaps
	campaignAnalysis.factionRepresentationGaps.forEach((gap) => {
		const factionName = gap.split(" needs ")[0]
		if (factionName) {
			suggestions.factionOpportunities.push({
				faction: factionName,
				role: "member",
				reasoning: `Addresses campaign gap: ${gap}`,
			})
		}
	})

	// Generate occupation-based relationship suggestions
	if (args.occupation) {
		const relatedNPCs = existingNPCs.filter((npc) =>
			npc.occupation.toLowerCase().includes(args.occupation?.toLowerCase() || ""),
		)

		relatedNPCs.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: { id: npc.id, name: npc.name, occupation: npc.occupation },
				suggestedRelationshipTypes: ["mentor", "rival", "former_colleague"],
				reasoning: `Professional connection through similar occupation`,
			})
		})
	}

	// Generate relationship hint-based suggestions
	if (args.relationship_hint) {
		const hintWords = args.relationship_hint.toLowerCase().split(/\s+/)
		const potentialTargets = existingNPCs.filter((npc) =>
			hintWords.some((word) => npc.name.toLowerCase().includes(word) || npc.occupation.toLowerCase().includes(word)),
		)

		potentialTargets.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: { id: npc.id, name: npc.name, occupation: npc.occupation },
				suggestedRelationshipTypes: ["family", "mentor", "friend", "rival", "enemy"],
				reasoning: `Matches relationship hint: ${args.relationship_hint}`,
			})
		})
	}

	// Add complexity guidance
	if (campaignAnalysis.complexityGaps.length > 0) {
		suggestions.characterComplexity = campaignAnalysis.complexityGaps.map((gap) => `Consider creating: ${gap}`)
	}

	// Add narrative integration hooks
	if (campaignAnalysis.narrativeIntegrationOpportunities.length > 0) {
		suggestions.narrativeHooks.push(
			"Consider connections to existing but underutilized NPCs",
			"Look for ways to tie into dormant storylines",
		)
	}

	// Add player perception guidance
	if (campaignAnalysis.playerPerceptionGaps.length > 0) {
		suggestions.narrativeHooks.push(...campaignAnalysis.playerPerceptionGaps)
	}

	return suggestions
}
