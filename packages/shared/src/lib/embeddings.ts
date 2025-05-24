import { GoogleGenerativeAI } from "@google/generative-ai"
import { type EmbeddedEntityName, embeddingTextGenerators } from "./embeddingIndex"

// Using console as logger placeholder
const logger = console

// Load API Key from environment
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
	logger.error("GEMINI_API_KEY environment variable is not set. Embedding generation will fail.")
}

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

// Re-export types and utilities for convenience
export type { EmbeddedEntityName } from "./embeddingIndex"
export { embeddingTextGenerators } from "./embeddingIndex"
