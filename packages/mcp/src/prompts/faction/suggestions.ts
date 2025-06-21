import type { Context } from "../baseContext"
import type { FactionCreationArgs } from "./types"

export function generateFactionRelationshipSuggestions({
	args,
	context,
	factionGaps,
}: {
	args: FactionCreationArgs
	context: Context
	factionGaps: Record<string, string[]>
}) {
	const suggestions = {
		potentialAllies: [] as unknown[],
		potentialRivals: [] as unknown[],
		territorialOpportunities: [] as unknown[],
		narrativeHooks: [] as unknown[],
	}

	const { factions, areas } = context
	const { name, alignment_hint, location_hint, type_hint } = args

	// 1. Suggest allies/rivals based on alignment and type hints
	if (alignment_hint) {
		const matchingAlignment = factions.filter((f) => f.publicAlignment.includes(alignment_hint))
		matchingAlignment.forEach((faction) => {
			suggestions.potentialAllies.push({
				faction: { id: faction.id, name: faction.name },
				reasoning: `Shares a similar public alignment (${alignment_hint}).`,
				suggestedRelationship: "ideological_alliance",
			})
		})
	}

	if (type_hint) {
		const matchingType = factions.filter((f) => f.type.includes(type_hint))
		matchingType.forEach((faction) => {
			suggestions.potentialAllies.push({
				faction: { id: faction.id, name: faction.name },
				reasoning: `Both are '${type_hint}' type factions, suggesting shared interests.`,
				suggestedRelationship: "professional_alliance",
			})
		})
	}

	// 2. Suggest territorial opportunities based on location hint and existing influence
	if (location_hint) {
		const area = areas.find((a) => a.name.toLowerCase().includes(location_hint.toLowerCase()))
		if (area) {
			const factionsInArea = area.factionInfluence.map((fi) => fi.faction.name)
			suggestions.territorialOpportunities.push({
				location: { id: area.id, name: area.name, type: "area" },
				reasoning: `The area '${area.name}' is a potential base of operations. Factions already active here: ${
					factionsInArea.length > 0 ? factionsInArea.join(", ") : "None"
				}.`,
				competitionLevel: factionsInArea.length > 0 ? "moderate" : "low",
			})
		}
	}

	// 3. Generate narrative hooks from the campaign gap analysis
	if (factionGaps) {
		Object.entries(factionGaps).forEach(([key, value]) => {
			if (Array.isArray(value) && value.length > 0) {
				suggestions.narrativeHooks.push({
					category: key,
					hooks: value,
				})
			}
		})
	}

	// 4. General narrative opportunities
	suggestions.narrativeHooks.push({
		category: "general",
		hooks: [
			`The creation of '${name}' could be a direct response to the actions of an existing faction.`,
			`'${name}' could be a splinter group from an established faction, creating immediate internal conflict.`,
			`This new faction could be the only one aware of a brewing, undiscovered threat.`,
		],
	})

	return suggestions
}
