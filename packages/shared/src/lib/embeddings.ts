import { GoogleGenerativeAI } from "@google/generative-ai"
// Assuming a shared logger exists or can be created, otherwise use console
// import { logger } from "../logger"; // Example path
const logger = console // Using console as a placeholder

// Define a type for the simple entity names we expect
// This should ideally be kept in sync with actual table names used
export type EmbeddedEntityName =
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
		// logger.info(`Generating embedding for text starting with: "${trimmedText.substring(0, 50)}..."`); // Reduce log verbosity
		const result = await embeddingModel.embedContent(trimmedText)
		const embedding = result.embedding
		if (!embedding || !embedding.values) {
			throw new Error("Gemini API did not return a valid embedding.")
		}
		// logger.info("Embedding generated successfully."); // Reduce log verbosity
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
 * @param entityName The simple name of the entity type (e.g., 'npcs', 'quests').
 * @param record The database record object, constrained to be an object.
 * @returns A combined text string.
 */
export function getTextForEntity<T extends Record<string, unknown>>(entityName: EmbeddedEntityName, record: T): string {
	let combinedText = ""

	const addField = (fieldValue: unknown) => {
		if (Array.isArray(fieldValue)) {
			const stringArray = fieldValue.filter((item): item is string => typeof item === "string")
			if (stringArray.length > 0) {
				combinedText += stringArray.join(". ") + ". "
			}
		} else if (typeof fieldValue === "string" && fieldValue.trim()) {
			combinedText += fieldValue.trim() + ". "
		}
	}

	// logger.debug(`Generating text for entity type: ${entityName}`, { recordId: record?.id }); // Reduce log verbosity

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
		default:
			logger.warn(`No specific text generation logic defined for entity name: ${entityName}`)
			for (const key in record) {
				if (typeof record[key] === "string" || Array.isArray(record[key])) {
					addField(record[key])
				}
			}
			if (!combinedText && record) {
				combinedText = JSON.stringify(record)
			}
	}

	const finalText = combinedText.trim().replace(/\.+$/, "")
	// logger.debug(`Generated text for ${entityName} ID ${record?.id}: "${finalText.substring(0, 100)}..."`); // Reduce log verbosity
	return finalText
}
