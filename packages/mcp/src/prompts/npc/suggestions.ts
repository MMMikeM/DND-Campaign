import type { Context } from "../baseContext"
import { getNpcContentGaps } from "./analysis"
import type { EnhancedNpcCreationArgs } from "./types"

export function generateNPCCreationSuggestions({ args, context }: { args: EnhancedNpcCreationArgs; context: Context }) {
	const gaps = getNpcContentGaps(context)

	const { npcs, sites, areas, regions, conflicts, factions, quests } = context

	const suggestions: Record<
		"targetNPCs" | "factionOpportunities" | "narrativeHooks" | "characterComplexity",
		unknown[]
	> = {
		targetNPCs: [],
		factionOpportunities: [],
		narrativeHooks: [],
		characterComplexity: [],
	}

	// 1. Location-based suggestions (NPCs, Factions, Hooks)
	sites.forEach((site) => {
		site.npcs.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: {
					id: npc.id,
					name: npc.name,
					occupation: npc.occupation,
				},
				suggestedRelationshipTypes: ["ally", "rival", "contact"],
				reasoning: `Regional connection - both associated with the site "${site.name}".`,
			})
		})
	})

	const influentialFactions = new Map<string, { type: "area" | "region"; name: string }>()

	areas.forEach((area) => {
		area.factionInfluence.forEach((influence) => {
			if (influence.faction) {
				influentialFactions.set(influence.faction.name, { type: "area", name: area.name })
			}
		})
	})
	regions.forEach((region) => {
		region.factionInfluence.forEach((influence) => {
			if (influence.faction) {
				influentialFactions.set(influence.faction.name, { type: "region", name: region.name })
			}
		})
	})

	influentialFactions.forEach((source, factionName) => {
		suggestions.factionOpportunities.push({
			faction: factionName,
			role: "member",
			reasoning: `This faction is influential in the ${source.type} "${source.name}".`,
		})
	})

	regions.forEach((region) => {
		region.conflicts.forEach((conflict) => {
			suggestions.narrativeHooks.push(
				`Connect to the ongoing conflict: "${conflict.name}" in the ${region.name} region. The NPC could be a participant, victim, or profiteer.`,
			)
		})
		region.consequences.forEach((quest) => {
			suggestions.narrativeHooks.push(
				`Tie into the existing quest: "${quest.name}" in the ${region.name} region. The NPC could offer a new lead, be a surprise obstacle, or hold a key piece of information.`,
			)
		})
	})

	// 2. Hint-based suggestions (Faction, Occupation, Relationship)
	if (args.faction_hint) {
		const lowerHint = args.faction_hint.toLowerCase()
		const matchingFactions = context.factions.filter(
			(f) => f.name.toLowerCase().includes(lowerHint) || f.type.some((t) => t.toLowerCase().includes(lowerHint)),
		)
		matchingFactions.forEach((faction) => {
			suggestions.factionOpportunities.push({
				faction: faction.name,
				role: args.role_hint || "member",
				reasoning: `Matches faction hint: "${args.faction_hint}".`,
			})

			const factionMembers = npcs.filter((npc) => npc.factionMemberships)

			factionMembers.forEach((member) => {
				suggestions.targetNPCs.push({
					npc: { id: member.id, name: member.name, occupation: member.occupation || "Unknown" },
					suggestedRelationshipTypes: ["comrade", "rival_within_faction", "mentor", "protege"],
					reasoning: `Potential connection through shared allegiance to ${faction.name}.`,
				})
			})
		})
	}

	if (args.occupation) {
		const relatedNPCs = npcs.filter((npc) =>
			npc.occupation?.toLowerCase().includes(args.occupation?.toLowerCase() || ""),
		)

		relatedNPCs.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: { id: npc.id, name: npc.name, occupation: npc.occupation || "Unknown" },
				suggestedRelationshipTypes: ["mentor", "rival", "former_colleague"],
				reasoning: `Professional connection through similar occupation: ${npc.occupation}.`,
			})
		})
	}

	if (args.relationship_hint) {
		const hintWords = args.relationship_hint.toLowerCase().split(/\s+/)
		const potentialTargets = npcs.filter((npc) =>
			hintWords.some((word) => npc.name.toLowerCase().includes(word) || npc.occupation?.toLowerCase().includes(word)),
		)

		potentialTargets.forEach((npc) => {
			suggestions.targetNPCs.push({
				npc: { id: npc.id, name: npc.name, occupation: npc.occupation || "Unknown" },
				suggestedRelationshipTypes: ["family", "mentor", "friend", "rival", "enemy"],
				reasoning: `Matches relationship hint: "${args.relationship_hint}".`,
			})
		})
	}

	// 3. Campaign Analysis-based suggestions (Gaps & Opportunities)
	gaps.factionMembership.forEach((gap) => {
		const factionName = gap.split(" needs ")[0]
		if (factionName) {
			suggestions.factionOpportunities.push({
				faction: factionName,
				role: "member",
				reasoning: `Addresses campaign gap: ${gap}`,
			})
		}
	})

	// if (gaps.complexityProfile.length > 0) {
	// 	suggestions.characterComplexity = gaps.complexityProfile.map((gap) => `Consider creating: ${gap}`)
	// }

	if (gaps.locationGaps.length > 0) {
		gaps.locationGaps.forEach((gap) => {
			suggestions.narrativeHooks.push(`World-building opportunity: ${gap} This NPC could be a catalyst for change.`)
		})
	}

	if (gaps.narrativeIntegrationOpportunities.length > 0) {
		suggestions.narrativeHooks.push(
			"Consider connections to existing but underutilized NPCs",
			"Look for ways to tie into dormant storylines",
		)
	}

	if (gaps.playerPerceptionGoal.length > 0) {
		suggestions.narrativeHooks.push(...gaps.playerPerceptionGoal)
	}

	return suggestions
}
