import { GoogleGenerativeAI } from "@google/generative-ai"
import { logger } from "./index" // Assuming logger is exported from index
import { tables } from "@tome-master/shared" // Import your Drizzle tables

// Load API Key from environment
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
	logger.error("GEMINI_API_KEY environment variable is not set.")
	// Optionally throw an error or handle appropriately
	// throw new Error("GEMINI_API_KEY environment variable is not set.");
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

	// Ensure text is not empty or just whitespace
	const trimmedText = text.trim()
	if (!trimmedText) {
		logger.warn("Attempted to generate embedding for empty text.")
		// Return a zero vector or handle as appropriate for your application
		// For pgvector, storing null might be better if the column allows it,
		// otherwise, a zero vector of the correct dimension (768) is needed.
		return Array(768).fill(0)
	}

	try {
		logger.info(`Generating embedding for text starting with: "${trimmedText.substring(0, 50)}..."`)
		const result = await embeddingModel.embedContent(trimmedText)
		const embedding = result.embedding
		if (!embedding || !embedding.values) {
			throw new Error("Gemini API did not return a valid embedding.")
		}
		logger.info("Embedding generated successfully.")
		return embedding.values
	} catch (error) {
		logger.error("Error generating Gemini embedding:", {
			error: error instanceof Error ? error.message : String(error),
			textSample: trimmedText.substring(0, 100), // Log a sample of the text
		})
		// Re-throw or handle as needed
		throw new Error(`Failed to generate Gemini embedding: ${error instanceof Error ? error.message : String(error)}`)
	}
}

/**
 * Combines relevant text fields from a database record into a single string for embedding.
 * @param entityType The type of entity (e.g., 'npcs', 'quests').
 * @param entityName The simple name of the entity type (e.g., 'npcs', 'quests').
 * @param record The database record object.
 * @returns A combined text string.
 */
// Define a type for the simple entity names we expect
type EntityName =
	| "npcs"
	| "quests"
	| "questStages"
	| "locations"
	| "regions"
	| "factions"
	| "factionOperations"
	| "factionCulture"
	| "items"
	| "clues"
	| "locationEncounters"
	| "locationSecrets"
// Add other entity names as needed

export function getTextForEntity(entityName: EntityName, record: Record<string, unknown>): string {
	let combinedText = ""

	// Helper to safely join array fields or add string fields
	const addField = (fieldValue: unknown) => {
		// Use unknown for better type safety than any
		if (Array.isArray(fieldValue)) {
			// Filter out non-string elements just in case
			const stringArray = fieldValue.filter((item) => typeof item === "string") as string[]
			if (stringArray.length > 0) {
				combinedText += stringArray.join(". ") + ". "
			}
		} else if (typeof fieldValue === "string" && fieldValue.trim()) {
			combinedText += fieldValue.trim() + ". "
		}
	}

	logger.debug(`Generating text for entity type: ${entityName}`, { recordId: record?.id })

	// Use the simple entityName string in the switch
	switch (entityName) {
		case "npcs":
			addField(record.name)
			addField(record.race)
			addField(record.occupation)
			addField(record.disposition)
			addField(record.attitude)
			addField(record.personalityTraits)
			addField(record.drives)
			addField(record.fears)
			addField(record.background)
			addField(record.knowledge)
			addField(record.secrets)
			addField(record.quirk)
			break
		case "quests":
			addField(record.name)
			addField(record.type)
			addField(record.description)
			addField(record.objectives)
			addField(record.themes)
			addField(record.mood)
			addField(record.successOutcomes)
			addField(record.failureOutcomes)
			break
		case "questStages":
			addField(record.name)
			addField(record.description)
			addField(record.objectives)
			addField(record.dramatic_question)
			addField(record.completionPaths)
			addField(record.dramatic_moments)
			addField(record.sensory_elements)
			break
		case "locations":
			addField(record.name)
			addField(record.locationType)
			addField(record.description)
			addField(record.terrain)
			addField(record.climate)
			addField(record.mood)
			addField(record.environment)
			addField(record.features)
			addField(record.soundscape)
			addField(record.smells)
			addField(record.descriptors)
			break
		case "regions":
			addField(record.name)
			addField(record.type)
			addField(record.description)
			addField(record.history)
			addField(record.culturalNotes)
			addField(record.pointsOfInterest)
			addField(record.rumors)
			addField(record.secrets)
			addField(record.economy)
			addField(record.population)
			break
		case "factions":
			addField(record.name)
			addField(record.type)
			addField(record.description)
			addField(record.values)
			addField(record.history)
			addField(record.publicGoal)
			addField(record.secretGoal)
			addField(record.publicPerception)
			addField(record.resources)
			break
		case "factionOperations":
			addField(record.name)
			addField(record.type)
			addField(record.description)
			addField(record.objectives)
			break
		case "factionCulture":
			addField(record.symbols)
			addField(record.rituals)
			addField(record.taboos)
			addField(record.aesthetics)
			addField(record.jargon)
			break
		case "items":
			addField(record.name)
			addField(record.type)
			addField(record.description)
			addField(record.significance)
			break
		case "clues":
			addField(record.description)
			addField(record.reveals)
			break
		case "locationEncounters":
			addField(record.name)
			addField(record.description)
			addField(record.creatures)
			break
		case "locationSecrets":
			addField(record.secretType)
			addField(record.description)
			addField(record.discoveryMethod)
			addField(record.consequences)
			break
		// Add cases for other tables as needed...
		default:
			// This default case should ideally handle any EntityName not explicitly listed
			// Or use a type assertion to ensure all cases are handled if possible
			logger.warn(`No specific text generation logic defined for entity name: ${entityName}`)
			// Fallback logic remains the same
			for (const key in record) {
				if (typeof record[key] === "string" || Array.isArray(record[key])) {
					addField(record[key])
				}
			}
			if (!combinedText && record) {
				// Check if record exists before stringifying
				combinedText = JSON.stringify(record) // Last resort
			}
	}

	const finalText = combinedText.trim().replace(/\.+$/, "") // Clean up trailing spaces/dots
	logger.debug(`Generated text for ${entityName} ID ${record?.id}: "${finalText.substring(0, 100)}..."`)
	return finalText
}
