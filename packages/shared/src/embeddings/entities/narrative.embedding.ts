import { createEmbeddingBuilder } from "../embedding-helpers"
import type { NarrativeDestinationEmbeddingInput, WorldConceptEmbeddingInput } from "../embedding-input-types"

export const embeddingTextForNarrativeDestination = (destination: NarrativeDestinationEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("Narrative Destination", destination.name, destination.description)

	builder.addFields("Arc Details", {
		type: destination.type,
		status: destination.status,
		primaryLocation: destination.primaryRegionName,
		promise: destination.promise,
		payoff: destination.payoff,
		intendedEmotionalArc: destination.intendedEmotionalArc,
	})

	builder
		.addList("Core Themes", destination.themes)
		.addList("Foreshadowing Elements", destination.foreshadowingElements)
		.ifPresent(destination.relatedConflictName, (b) =>
			b.addSection("Related Conflict", destination.relatedConflictName),
		)
		.addList("Key Quests in Arc", destination.keyQuestNamesInArc)

	return builder.build()
}

export const embeddingTextForWorldConcept = (concept: WorldConceptEmbeddingInput): string => {
	const builder = createEmbeddingBuilder()

	builder.setEntity("World Concept", concept.name, concept.description)

	builder.addFields("Core Details", {
		type: concept.conceptType,
		complexity: concept.complexityProfile,
		moralClarity: concept.moralClarity,
		scope: concept.scope,
		status: concept.status,
		timeframe: concept.timeframe,
		startYear: concept.startYear,
		endYear: concept.endYear,
		modernRelevance: concept.modernRelevance,
	})

	builder.addFields("Perspectives", {
		summary: concept.summary,
		surfaceImpression: concept.surfaceImpression,
		livedReality: concept.livedRealityDetails,
		hiddenDepths: concept.hiddenTruthsOrDepths,
		socialStructure: concept.socialStructure,
	})

	builder
		.addList("Core Values", concept.coreValues)
		.addList("Additional Details", concept.additionalDetails)
		.addList("Current Challenges", concept.currentChallenges)
		.addList("Modern Consequences", concept.modernConsequences)
		.addList("Quest Hooks", concept.questHooks)
		.addList("Related Concepts", concept.keyRelatedConceptNamesAndTypes)
		.addList("Primary Regions", concept.primaryRegionNamesWhereRelevant)
		.addList("Key Factions", concept.keyFactionNamesRepresentingConcept)

	return builder.build()
}
