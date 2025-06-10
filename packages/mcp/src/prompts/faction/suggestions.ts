import { search } from "fast-fuzzy"
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

	// Generate ally suggestions based on alignment with fuzzy matching
	if (alignment_hint) {
		const alignmentHint = alignment_hint.toLowerCase()
		const alignmentAllies = existingFactions.filter((faction) => {
			const factionAlignment = faction.publicAlignment.toLowerCase()

			// Use fuzzy search to match alignment keywords
			const alignmentKeywords = ["good", "evil", "lawful", "chaotic", "neutral"]
			const hintKeywords = alignmentKeywords.filter(
				(keyword) => search(keyword, [alignmentHint], { threshold: 0.8 }).length > 0,
			)
			const factionKeywords = alignmentKeywords.filter(
				(keyword) => search(keyword, [factionAlignment], { threshold: 0.8 }).length > 0,
			)

			// Find matching alignment components
			return hintKeywords.some((keyword) => factionKeywords.includes(keyword))
		})

		alignmentAllies.slice(0, 3).forEach((faction) => {
			suggestions.potentialAllies.push({
				faction: { id: faction.id, name: faction.name, type: faction.type },
				reasoning: `Shared alignment values (${alignment_hint} with ${faction.publicAlignment})`,
				suggestedRelationshipType: "ideological_alliance",
			})
		})
	}

	// Generate rival suggestions based on opposing alignments with fuzzy matching
	if (alignment_hint) {
		const alignmentHint = alignment_hint.toLowerCase()
		const alignmentRivals = existingFactions.filter((faction) => {
			const factionAlignment = faction.publicAlignment.toLowerCase()

			// Define opposing alignments
			const oppositions = {
				good: ["evil"],
				evil: ["good"],
				lawful: ["chaotic"],
				chaotic: ["lawful"],
			}

			// Use fuzzy search to find alignment keywords
			const alignmentKeywords = Object.keys(oppositions)
			const hintKeywords = alignmentKeywords.filter(
				(keyword) => search(keyword, [alignmentHint], { threshold: 0.8 }).length > 0,
			)
			const factionKeywords = alignmentKeywords.filter(
				(keyword) => search(keyword, [factionAlignment], { threshold: 0.8 }).length > 0,
			)

			// Check for opposing alignments
			return hintKeywords.some((hintKeyword) =>
				factionKeywords.some((factionKeyword) =>
					oppositions[hintKeyword as keyof typeof oppositions]?.includes(factionKeyword),
				),
			)
		})

		alignmentRivals.slice(0, 2).forEach((faction) => {
			suggestions.potentialRivals.push({
				faction: { id: faction.id, name: faction.name, type: faction.type },
				reasoning: `Opposing alignment (${alignment_hint} vs ${faction.publicAlignment})`,
				conflictType: "ideological_conflict",
			})
		})
	}

	// Generate suggestions based on faction type with fuzzy matching
	if (type_hint) {
		const typeAllies = existingFactions.filter((faction) => {
			// Use fuzzy search to match similar types
			return faction.type.some((factionType) => {
				const fuzzyResult = search(type_hint, [factionType], { threshold: 0.7 })
				return fuzzyResult.length > 0
			})
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

		// Competing types might be rivals with fuzzy matching
		const competingTypes: Record<string, string[]> = {
			criminal: ["military", "political"],
			military: ["criminal", "cult"],
			religious: ["cult", "arcane"],
			mercantile: ["guild", "criminal"],
			political: ["cult", "criminal"],
		}

		// Use fuzzy search to find the matching competing type
		const typeKeys = Object.keys(competingTypes)
		const [matchingTypeKey] = search(type_hint, typeKeys, { threshold: 0.7 })

		if (matchingTypeKey && competingTypes[matchingTypeKey]) {
			const typeRivals = existingFactions.filter((faction) =>
				faction.type.some((factionType) => {
					// Use fuzzy search for competing types
					return competingTypes[matchingTypeKey]?.some(
						(competingType) => search(competingType, [factionType], { threshold: 0.7 }).length > 0,
					)
				}),
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

	// Generate location-based suggestions with fuzzy matching
	if (location_hint) {
		const locationNames = existingFactions
			.map((faction) => faction.primaryHqSite?.area?.name)
			.filter(Boolean) as string[]

		const fuzzyLocationMatches = search(location_hint, locationNames, { threshold: 0.6 })

		const sameLocationFactions = existingFactions.filter((faction) => {
			const areaName = faction.primaryHqSite?.area?.name
			return areaName && fuzzyLocationMatches.includes(areaName)
		})

		sameLocationFactions.forEach((faction) => {
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

	// Generate role-based narrative opportunities with fuzzy matching
	if (role_hint) {
		const roleHintLower = role_hint.toLowerCase()
		const roleKeywords = ["ally", "enemy", "neutral"]
		const [matchingRole] = search(roleHintLower, roleKeywords, { threshold: 0.7 })

		switch (matchingRole) {
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
