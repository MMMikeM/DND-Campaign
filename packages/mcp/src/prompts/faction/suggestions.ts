import type { FactionCreationArgs, FactionForAnalysis, FactionRelationshipSuggestions } from "./types"

export function generateFactionRelationshipSuggestions(
	{ name, alignment_hint, location_hint, role_hint, type_hint }: FactionCreationArgs,
	existingFactions: FactionForAnalysis[],
): FactionRelationshipSuggestions {
	const suggestions: FactionRelationshipSuggestions = {
		potentialAllies: [],
		potentialRivals: [],
		territorialOverlap: [],
		narrativeOpportunities: [],
	}

	// Generate ally suggestions based on alignment
	if (alignment_hint) {
		const alignmentAllies = existingFactions.filter((faction) => {
			const isGoodAlignment = alignment_hint.includes("good")
			const isEvilAlignment = alignment_hint.includes("evil")
			const isLawfulAlignment = alignment_hint.includes("lawful")
			const isChaoticAlignment = alignment_hint.includes("chaotic")

			// Good factions align with good, evil with evil
			if (isGoodAlignment && faction.publicAlignment.includes("good")) return true
			if (isEvilAlignment && faction.publicAlignment.includes("evil")) return true

			// Lawful factions might ally regardless of good/evil
			if (isLawfulAlignment && faction.publicAlignment.includes("lawful")) return true
			if (isChaoticAlignment && faction.publicAlignment.includes("chaotic")) return true

			return false
		})

		alignmentAllies.slice(0, 3).forEach((faction) => {
			suggestions.potentialAllies.push({
				faction: { id: faction.id, name: faction.name, type: faction.type },
				reasoning: `Shared alignment values (${alignment_hint} with ${faction.publicAlignment})`,
				suggestedRelationshipType: "ideological_alliance",
			})
		})
	}

	// Generate rival suggestions based on opposing alignments
	if (alignment_hint) {
		const alignmentRivals = existingFactions.filter((faction) => {
			const isGoodAlignment = alignment_hint.includes("good")
			const isEvilAlignment = alignment_hint.includes("evil")
			const isLawfulAlignment = alignment_hint.includes("lawful")
			const isChaoticAlignment = alignment_hint.includes("chaotic")

			// Good opposes evil
			if (isGoodAlignment && faction.publicAlignment.includes("evil")) return true
			if (isEvilAlignment && faction.publicAlignment.includes("good")) return true

			// Lawful opposes chaotic
			if (isLawfulAlignment && faction.publicAlignment.includes("chaotic")) return true
			if (isChaoticAlignment && faction.publicAlignment.includes("lawful")) return true

			return false
		})

		alignmentRivals.slice(0, 2).forEach((faction) => {
			suggestions.potentialRivals.push({
				faction: { id: faction.id, name: faction.name, type: faction.type },
				reasoning: `Opposing alignment (${alignment_hint} vs ${faction.publicAlignment})`,
				conflictType: "ideological_conflict",
			})
		})
	}

	// Generate suggestions based on faction type
	if (type_hint) {
		const typeAllies = existingFactions.filter((faction) => {
			// Similar types might ally
			return faction.type.some((factionType) => factionType === type_hint)
		})

		typeAllies.slice(0, 2).forEach((faction) => {
			if (!suggestions.potentialAllies.some((ally) => ally.faction.id === faction.id)) {
				suggestions.potentialAllies.push({
					faction: { id: faction.id, name: faction.name, type: faction.type },
					reasoning: `Similar organizational structure (both ${type_hint})`,
					suggestedRelationshipType: "professional_alliance",
				})
			}
		})

		// Competing types might be rivals
		const competingTypes: Record<string, string[]> = {
			criminal: ["military", "political"],
			military: ["criminal", "cult"],
			religious: ["cult", "arcane"],
			mercantile: ["guild", "criminal"],
			political: ["cult", "criminal"],
		}

		if (competingTypes[type_hint]) {
			const typeRivals = existingFactions.filter((faction) =>
				faction.type.some((factionType) => competingTypes[type_hint]?.includes(factionType)),
			)

			typeRivals.slice(0, 2).forEach((faction) => {
				if (!suggestions.potentialRivals.some((rival) => rival.faction.id === faction.id)) {
					suggestions.potentialRivals.push({
						faction: { id: faction.id, name: faction.name, type: faction.type },
						reasoning: `Competing organizational interests (${type_hint} vs ${faction.type.join(", ")})`,
						conflictType: "resource_competition",
					})
				}
			})
		}
	}

	// Generate location-based suggestions
	if (location_hint) {
		const samLocationFactions = existingFactions.filter(
			(faction) => faction.primaryHqSite?.area?.name?.toLowerCase().includes(location_hint.toLowerCase()) || false,
		)

		samLocationFactions.forEach((faction) => {
			suggestions.territorialOverlap.push({
				location: {
					id: faction.primaryHqSite?.area?.id || 0,
					name: faction.primaryHqSite?.area?.name || "Unknown",
					type: "area",
				},
				reasoning: `Both factions operate in ${location_hint}`,
				competitionLevel: "moderate",
			})
		})
	}

	// Generate role-based narrative opportunities
	if (role_hint) {
		switch (role_hint.toLowerCase()) {
			case "ally":
				suggestions.narrativeOpportunities.push(
					"Could serve as quest-giver or information source",
					"Potential patron for player characters",
					"Resource provider for party missions",
				)
				break
			case "enemy":
				suggestions.narrativeOpportunities.push(
					"Primary antagonist for faction-based storylines",
					"Source of recurring conflicts and obstacles",
					"Target for infiltration or espionage missions",
				)
				break
			case "neutral":
				suggestions.narrativeOpportunities.push(
					"Mediator in conflicts between other factions",
					"Information broker with connections to multiple sides",
					"Potential ally or enemy based on party actions",
				)
				break
			default:
				suggestions.narrativeOpportunities.push(
					"Flexible role based on campaign development",
					"Could evolve based on player character relationships",
				)
		}
	}

	// Add general narrative opportunities
	suggestions.narrativeOpportunities.push(
		`Could create new ${name}-related questlines`,
		"Potential source of faction missions and political intrigue",
		"Opportunity to expand campaign's political complexity",
	)

	return suggestions
}
