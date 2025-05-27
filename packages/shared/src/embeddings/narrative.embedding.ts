import { EmbeddingBuilder } from "./embedding-helpers"
import type { NarrativeDestinationEmbeddingInput, WorldConceptEmbeddingInput } from "./embedding-input-types"

export const embeddingTextForNarrativeDestination = (destination: NarrativeDestinationEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("Narrative Destination", destination.name)
		.overview(destination.description)
		.fields([
			{ label: "Type", value: destination.type },
			{ label: "Status", value: destination.status },
			{ label: "Primary Location", value: destination.primaryRegionName },
			{ label: "Promise", value: destination.promise },
			{ label: "Payoff", value: destination.payoff },
			{ label: "Intended Emotional Arc", value: destination.intendedEmotionalArc },
		])
		.list("Core Themes", destination.themes)
		.list("Foreshadowing Elements", destination.foreshadowingElements)
		.field("Related Conflict", destination.relatedConflictName)
		.list("Key Quests in Arc", destination.keyQuestNamesInArc)
		.build()
}

export const embeddingTextForWorldConcept = (concept: WorldConceptEmbeddingInput): string => {
	return new EmbeddingBuilder()
		.title("World Concept", concept.name)
		.overview(concept.description)
		.fields([
			{ label: "Type", value: concept.conceptType },
			{ label: "Complexity", value: concept.complexityProfile },
			{ label: "Moral Clarity", value: concept.moralClarity },
			{ label: "Scope", value: concept.scope },
			{ label: "Status", value: concept.status },
			{ label: "Timeframe", value: concept.timeframe },
			{ label: "Start Year", value: concept.startYear },
			{ label: "End Year", value: concept.endYear },
			{ label: "Modern Relevance", value: concept.modernRelevance },
			{ label: "Summary", value: concept.summary },
			{ label: "Surface Impression", value: concept.surfaceImpression },
			{ label: "Lived Reality", value: concept.livedRealityDetails },
			{ label: "Hidden Depths", value: concept.hiddenTruthsOrDepths },
			{ label: "Social Structure", value: concept.socialStructure },
		])
		.list("Core Values", concept.coreValues)
		.list("Additional Details", concept.additionalDetails)
		.lists([
			{ title: "Current Challenges", items: concept.currentChallenges },
			{ title: "Modern Consequences", items: concept.modernConsequences },
			{ title: "Quest Hooks", items: concept.questHooks },
			{ title: "Related Concepts", items: concept.keyRelatedConceptNamesAndTypes },
			{ title: "Primary Regions", items: concept.primaryRegionNamesWhereRelevant },
			{ title: "Key Factions", items: concept.keyFactionNamesRepresentingConcept },
		])
		.build()
}
