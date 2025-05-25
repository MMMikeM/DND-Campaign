import { GoogleGenerativeAI } from "@google/generative-ai"
import { getTextForEmbedding } from "../lib/embeddings"
import type { majorConflicts } from "../schemas/conflict/tables"
import type { narrativeEvents, worldStateChanges } from "../schemas/events/tables"
import type { factionAgendas, factionCulture, factions } from "../schemas/factions/tables"
import type { discoverableElements } from "../schemas/investigation/tables"
import type { items } from "../schemas/items/tables"
import type { narrativeDestinations } from "../schemas/narrative/tables"
import type { npcs } from "../schemas/npc/tables"
import type { questStages, quests } from "../schemas/quests/tables"
import type { areas, regions, siteEncounters, siteSecrets, sites } from "../schemas/regions/tables"
import type { worldConcepts } from "../schemas/worldbuilding/tables"

// Type definitions for entity names
export type EmbeddedEntityName =
	| "areas"
	| "discoverableElements"
	| "factionAgendas"
	| "factionCulture"
	| "factions"
	| "items"
	| "majorConflicts"
	| "narrativeDestinations"
	| "narrativeEvents"
	| "npcs"
	| "quests"
	| "questStages"
	| "regions"
	| "siteEncounters"
	| "sites"
	| "siteSecrets"
	| "worldConcepts"
	| "worldStateChanges"

const logger = console

/**
 * Combines relevant text fields from a database record into a single string for embedding.
 * Uses entity-specific text generators from the centralized registry.
 * @param entityName The simple name of the entity type (e.g., 'npcs', 'quests').
 * @param record The database record object.
 * @returns A combined text string ready for embedding.
 */

export function getTextForEntity<T extends Record<string, unknown>>(entityName: EmbeddedEntityName, record: T): string {
	const textGenerator = embeddingTextGenerators[entityName]
	if (!textGenerator) {
		logger.warn(`No text generator defined for entity name: ${entityName}. Using JSON fallback.`)
		return JSON.stringify(record)
	}

	try {
		const text = textGenerator(record as any)
		return text
	} catch (error) {
		logger.error(`Error generating text for ${entityName}:`, error)
		// Fallback to JSON representation

		return JSON.stringify(record)
	}
}

// Load API Key from environment
const apiKey = process.env.GEMINI_API_KEY

// Initialize Gemini Client (only if API key is available)
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const embeddingModel = genAI?.getGenerativeModel({ model: "gemini-embedding-exp-03-07" })

/**
 * Generates an embedding for the given text using the Gemini API.
 * @param text The text to embed.
 * @returns A promise that resolves with the embedding vector (array of numbers).
 * @throws Throws an error if the API key is missing or the API call fails.
 */
export async function getGeminiEmbedding(text: string): Promise<number[]> {
	if (!embeddingModel) {
		logger.error("Gemini client not initialized. API Key might be missing.")
		throw new Error("Gemini client not initialized. API Key might be missing.")
	}

	const trimmedText = text.trim()
	if (!trimmedText) {
		logger.warn("Attempted to generate embedding for empty text.")
		return Array(768).fill(0) // Return zero vector for empty input
	}

	try {
		const result = await embeddingModel.embedContent(trimmedText)
		const embedding = result.embedding
		if (!embedding || !embedding.values) {
			throw new Error("Gemini API did not return a valid embedding.")
		}
		return embedding.values
	} catch (error) {
		logger.error("Error generating Gemini embedding:", {
			error: error instanceof Error ? error.message : String(error),
			textSample: trimmedText.substring(0, 100),
		})
		throw new Error(`Failed to generate Gemini embedding: ${error instanceof Error ? error.message : String(error)}`)
	}
}

const embeddingTextForItem = (item: typeof items.$inferSelect) =>
	getTextForEmbedding(item, ["name", "itemType", "description", "significance", "creativePrompts"])

const embeddingTextForDiscoverableElement = (element: typeof discoverableElements.$inferSelect) =>
	getTextForEmbedding(element, [
		"name",
		"purposeType",
		"discoveryMethod",
		"description",
		"revealsInformation",
		"foreshadowsElement",
		"subtlety",
		"narrativeWeight",
		"clueType",
		"reliability",
		"playerNotes",
		"gmNotes",
		"creativePrompts",
	])

const embeddingTextForMajorConflict = (conflict: typeof majorConflicts.$inferSelect) =>
	getTextForEmbedding(conflict, [
		"name",
		"scope",
		"nature",
		"status",
		"cause",
		"description",
		"stakes",
		"moralDilemma",
		"possibleOutcomes",
		"hiddenTruths",
		"creativePrompts",
	])

const embeddingTextForNarrativeEvent = (event: typeof narrativeEvents.$inferSelect) =>
	getTextForEmbedding(event, [
		"name",
		"eventType",
		"description",
		"narrativePlacement",
		"impactSeverity",
		"complication_details",
		"escalation_details",
		"twist_reveal_details",
		"creativePrompts",
		"gmNotes",
	])

const embeddingTextForRegion = (region: typeof regions.$inferSelect) =>
	getTextForEmbedding(region, [
		"name",
		"type",
		"description",
		"history",
		"culturalNotes",
		"pointsOfInterest",
		"rumors",
		"secrets",
		"economy",
		"population",
		"hazards",
		"security",
		"dangerLevel",
		"creativePrompts",
	])

const embeddingTextForArea = (area: typeof areas.$inferSelect) =>
	getTextForEmbedding(area, [
		"name",
		"type",
		"dangerLevel",
		"leadership",
		"population",
		"primaryActivity",
		"description",
		"culturalNotes",
		"creativePrompts",
		"hazards",
		"pointsOfInterest",
		"rumors",
		"defenses",
	])

const embeddingTextForSite = (site: typeof sites.$inferSelect) =>
	getTextForEmbedding(site, [
		"name",
		"siteType",
		"terrain",
		"climate",
		"mood",
		"environment",
		"creativePrompts",
		"creatures",
		"description",
		"features",
		"treasures",
		"lightingDescription",
		"soundscape",
		"smells",
		"weather",
		"descriptors",
	])

const embeddingTextForSiteEncounter = (encounter: typeof siteEncounters.$inferSelect) =>
	getTextForEmbedding(encounter, [
		"name",
		"encounterType",
		"dangerLevel",
		"difficulty",
		"description",
		"creativePrompts",
		"creatures",
		"treasure",
	])

const embeddingTextForSiteSecret = (secret: typeof siteSecrets.$inferSelect) =>
	getTextForEmbedding(secret, [
		"secretType",
		"difficultyToDiscover",
		"discoveryMethod",
		"description",
		"creativePrompts",
		"consequences",
	])

const embeddingTextForWorldStateChange = (change: typeof worldStateChanges.$inferSelect) =>
	getTextForEmbedding(change, [
		"name",
		"changeType",
		"severity",
		"visibility",
		"timeframe",
		"sourceType",
		"description",
		"gmNotes",
		"creativePrompts",
	])

const embeddingTextForNpc = (npc: typeof npcs.$inferSelect) =>
	getTextForEmbedding(npc, [
		"name",
		"race",
		"gender",
		"age",
		"occupation",
		"alignment",
		"disposition",
		"attitude",
		"personalityTraits",
		"drives",
		"fears",
		"background",
		"knowledge",
		"secrets",
		"quirk",
		"appearance",
		"mannerisms",
		"biases",
		"socialStatus",
		"wealth",
		"voiceNotes",
	])

const embeddingTextForQuest = (quest: typeof quests.$inferSelect) =>
	getTextForEmbedding(quest, [
		"name",
		"type",
		"description",
		"objectives",
		"themes",
		"mood",
		"urgency",
		"visibility",
		"successOutcomes",
		"failureOutcomes",
		"rewards",
		"inspirations",
		"creativePrompts",
	])

const embeddingTextForQuestStage = (stage: typeof questStages.$inferSelect) =>
	getTextForEmbedding(stage, [
		"name",
		"description",
		"objectives",
		"dramatic_question",
		"completionPaths",
		"encounters",
		"dramatic_moments",
		"sensory_elements",
		"creativePrompts",
	])
const embeddingTextForFaction = (faction: typeof factions.$inferSelect) =>
	getTextForEmbedding(faction, [
		"name",
		"type",
		"description",
		"values",
		"history",
		"publicGoal",
		"secretGoal",
		"publicPerception",
		"resources",
	])

const embeddingTextForFactionAgenda = (agenda: typeof factionAgendas.$inferSelect) =>
	getTextForEmbedding(agenda, [
		"name",
		"agendaType",
		"currentStage",
		"importance",
		"ultimateAim",
		"moralAmbiguity",
		"description",
		"hiddenCosts",
		"keyOpponents",
		"internalConflicts",
		"approach",
		"publicImage",
		"personalStakes",
		"storyHooks",
		"creativePrompts",
	])

const embeddingTextForFactionCulture = (culture: typeof factionCulture.$inferSelect) =>
	getTextForEmbedding(culture, ["symbols", "rituals", "taboos", "aesthetics", "jargon", "recognitionSigns"])

export const embeddingTextForNarrativeDestination = (destination: typeof narrativeDestinations.$inferSelect) =>
	getTextForEmbedding(destination, [
		"name",
		"type",
		"promise",
		"payoff",
		"description",
		"themes",
		"foreshadowingElements",
		"creativePrompts",
	])

export const embeddingTextForWorldConcept = (concept: typeof worldConcepts.$inferSelect) =>
	getTextForEmbedding(concept, [
		"name",
		"conceptType",
		"timeframe",
		"startYear",
		"endYear",
		"scope",
		"primaryRegions",
		"summary",
		"details",
		"modernRelevance",
		"socialStructure",
		"coreValues",
		"traditions",
		"languages",
		"definingCharacteristics",
		"majorEvents",
		"keyFigures",
		"lastingInstitutions",
		"conflictingNarratives",
		"relatedFactions",
		"representativeFactions",
		"allies",
		"rivals",
		"historicalGrievances",
		"causedBy",
		"ledTo",
		"questHooks",
		"currentChallenges",
		"adaptationStrategies",
		"modernConsequences",
		"creativePrompts",
	])

export const embeddingTextGenerators = {
	areas: embeddingTextForArea,
	discoverableElements: embeddingTextForDiscoverableElement,
	factionAgendas: embeddingTextForFactionAgenda,
	factionCulture: embeddingTextForFactionCulture,
	factions: embeddingTextForFaction,
	items: embeddingTextForItem,
	majorConflicts: embeddingTextForMajorConflict,
	narrativeDestinations: embeddingTextForNarrativeDestination,
	narrativeEvents: embeddingTextForNarrativeEvent,
	npcs: embeddingTextForNpc,
	quests: embeddingTextForQuest,
	questStages: embeddingTextForQuestStage,
	regions: embeddingTextForRegion,
	siteEncounters: embeddingTextForSiteEncounter,
	sites: embeddingTextForSite,
	siteSecrets: embeddingTextForSiteSecret,
	worldConcepts: embeddingTextForWorldConcept,
	worldStateChanges: embeddingTextForWorldStateChange,
} as const
