import { GoogleGenerativeAI } from "@google/generative-ai"

// Export only the types that are actually used in implemented embedding functions
export type {
	AreaEmbeddingInput,
	ConsequenceEmbeddingInput,
	FactionAgendaEmbeddingInput,
	FactionEmbeddingInput,
	ForeshadowingSeedEmbeddingInput,
	ItemEmbeddingInput,
	MajorConflictEmbeddingInput,
	NarrativeDestinationEmbeddingInput,
	NarrativeEventEmbeddingInput,
	NpcEmbeddingInput,
	NpcRelationshipEmbeddingInput,
	QuestEmbeddingInput,
	QuestStageEmbeddingInput,
	RegionEmbeddingInput,
	SiteEmbeddingInput,
	SiteEncounterEmbeddingInput,
	SiteSecretEmbeddingInput,
	StageDecisionEmbeddingInput,
	WorldConceptEmbeddingInput,
} from "./embedding-input-types"

import { embeddingTextForMajorConflict } from "./conflicts.embedding"
import { embeddingTextForConsequence, embeddingTextForNarrativeEvent } from "./events.embedding"
import { embeddingTextForFaction, embeddingTextForFactionAgenda } from "./factions.embedding"
import { embeddingTextForForeshadowingSeed } from "./foreshadowing.embedding"
import { embeddingTextForItem } from "./items.embedding"
import { embeddingTextForNarrativeDestination, embeddingTextForWorldConcept } from "./narrative.embedding"
import { embeddingTextForCharacterRelationship, embeddingTextForNpc } from "./npcs.embedding"
import { embeddingTextForQuest, embeddingTextForQuestStage, embeddingTextForStageDecision } from "./quests.embedding"
import { embeddingTextForArea, embeddingTextForRegion } from "./regions.embedding"
import { embeddingTextForSite, embeddingTextForSiteEncounter, embeddingTextForSiteSecret } from "./sites.embedding"

// Type definitions for entity names
export type EmbeddedEntityName =
	| "areas"
	| "factionAgendas"
	| "factions"
	| "foreshadowingSeeds"
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
	| "consequences"
	| "stageDecisions"
	| "characterRelationships"

const logger = console

/**
 * Combines relevant text fields from a database record into a single string for embedding.
 * Uses entity-specific text generators from the centralized registry.
 * @param entityName The simple name of the entity type (e.g., 'npcs', 'quests').
 * @param record The database record object (can be hydrated with related data).
 * @param additionalData Optional additional data for entities that require related information.
 * @returns A combined text string ready for embedding.
 */

export function getTextForEntity<T>(entityName: EmbeddedEntityName, record: T, additionalData?: any): string {
	const textGenerator = embeddingTextGenerators[entityName]
	if (!textGenerator) {
		logger.warn(`No text generator defined for entity name: ${entityName}. Using JSON fallback.`)
		return JSON.stringify(record)
	}

	try {
		// Special handling for character relationships which need additional data
		if (entityName === "characterRelationships" && additionalData) {
			const text = (textGenerator as any)(record, additionalData.npc1Name, additionalData.npc2Name)
			return text
		}

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
		return Array(3072).fill(0) // Return zero vector for empty input (Gemini embedding dimensions)
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

export const embeddingTextGenerators = {
	areas: embeddingTextForArea,
	factionAgendas: embeddingTextForFactionAgenda,
	factions: embeddingTextForFaction,
	foreshadowingSeeds: embeddingTextForForeshadowingSeed,
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
	consequences: embeddingTextForConsequence,
	stageDecisions: embeddingTextForStageDecision,
	characterRelationships: embeddingTextForCharacterRelationship,
} as const

// Batch embedding utility
export async function generateEmbeddingsForEntities<T>(
	entityName: EmbeddedEntityName,
	records: T[],
	getAdditionalData?: (record: T) => any,
): Promise<Array<{ record: T; embedding: number[] }>> {
	const results = []
	for (const record of records) {
		try {
			const additionalData = getAdditionalData?.(record)
			const text = getTextForEntity(entityName, record, additionalData)
			const embedding = await getGeminiEmbedding(text)
			results.push({ record, embedding })
		} catch (error) {
			console.error(`Failed to generate embedding for ${entityName} record:`, error)
			// Continue with others
		}
	}
	return results
}
