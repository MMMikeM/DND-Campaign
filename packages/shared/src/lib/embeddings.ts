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
	| "sites"
	| "regions"
	| "factions"
	| "factionOperations"
	| "factionCulture"
	| "items"
	| "clues"
	| "siteEncounters"
	| "siteSecrets"
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
		// Using gemini-embedding-exp-03-07 which outputs 3072 dimensions.
		// The SDK call likely only takes the text content.
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

	// Helper to add prefixed fields
	const addPrefixedField = (prefix: string, fieldValue: unknown) => {
		if (typeof fieldValue === "string" && fieldValue.trim()) {
			combinedText += `${prefix}: ${fieldValue.trim()}. `
		} else if (Array.isArray(fieldValue)) {
			// Filter for non-empty strings after trimming
			const stringArray = fieldValue.filter((item): item is string => typeof item === "string" && item.trim() !== "")
			if (stringArray.length > 0) {
				combinedText += `${prefix}: ${stringArray.join(". ")}. `
			}
		}
	}

	switch (entityName) {
		case "npcs":
			addPrefixedField("Name", record.name)
			addPrefixedField("Race", record.race)
			addPrefixedField("Gender", record.gender)
			addPrefixedField("Age", record.age)
			addPrefixedField("Occupation", record.occupation)
			addPrefixedField("Alignment", record.alignment)
			addPrefixedField("Disposition", record.disposition)
			addPrefixedField("Attitude", record.attitude)
			addPrefixedField("Personality Traits", record.personalityTraits)
			addPrefixedField("Drives", record.drives)
			addPrefixedField("Fears", record.fears)
			addPrefixedField("Background", record.background)
			addPrefixedField("Knowledge", record.knowledge)
			addPrefixedField("Secrets", record.secrets)
			addPrefixedField("Quirk", record.quirk)
			addPrefixedField("Appearance", record.appearance)
			addPrefixedField("Mannerisms", record.mannerisms)
			addPrefixedField("Biases", record.biases)
			addPrefixedField("Social Status", record.socialStatus)
			addPrefixedField("Wealth", record.wealth)
			addPrefixedField("Voice Notes", record.voiceNotes)
			// Consider adding related info like faction role or key relationships if needed later
			break
		case "quests":
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.type)
			addPrefixedField("Description", record.description)
			addPrefixedField("Objectives", record.objectives)
			addPrefixedField("Themes", record.themes)
			addPrefixedField("Mood", record.mood)
			addPrefixedField("Urgency", record.urgency)
			addPrefixedField("Visibility", record.visibility)
			addPrefixedField("Success Outcomes", record.successOutcomes)
			addPrefixedField("Failure Outcomes", record.failureOutcomes)
			addPrefixedField("Rewards", record.rewards)
			addPrefixedField("Inspirations", record.inspirations)
			// Consider adding summaries of key twists or dependencies
			break
		case "questStages":
			addPrefixedField("Name", record.name)
			addPrefixedField("Description", record.description)
			addPrefixedField("Objectives", record.objectives)
			addPrefixedField("Dramatic Question", record.dramatic_question)
			addPrefixedField("Completion Paths", record.completionPaths)
			addPrefixedField("Encounters", record.encounters)
			addPrefixedField("Dramatic Moments", record.dramatic_moments)
			addPrefixedField("Sensory Elements", record.sensory_elements)
			// Consider adding summaries of key decisions/outcomes originating from this stage
			break
		case "sites":
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.siteType)
			addPrefixedField("Description", record.description)
			addPrefixedField("Terrain", record.terrain)
			addPrefixedField("Climate", record.climate)
			addPrefixedField("Mood", record.mood)
			addPrefixedField("Environment", record.environment)
			addPrefixedField("Features", record.features)
			addPrefixedField("Soundscape", record.soundscape)
			addPrefixedField("Smells", record.smells)
			addPrefixedField("Lighting", record.lightingDescription)
			addPrefixedField("Weather", record.weather)
			addPrefixedField("Descriptors", record.descriptors)
			addPrefixedField("Creatures", record.creatures)
			addPrefixedField("Treasures", record.treasures)
			// Consider adding summaries of key encounters or secrets
			break
		case "regions":
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.type)
			addPrefixedField("Description", record.description)
			addPrefixedField("History", record.history)
			addPrefixedField("Cultural Notes", record.culturalNotes)
			addPrefixedField("Points of Interest", record.pointsOfInterest)
			addPrefixedField("Rumors", record.rumors)
			addPrefixedField("Secrets", record.secrets)
			addPrefixedField("Economy", record.economy)
			addPrefixedField("Population", record.population)
			addPrefixedField("Hazards", record.hazards)
			addPrefixedField("Security/Defenses", record.security)
			addPrefixedField("Danger Level", record.dangerLevel)
			break
		case "factions":
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.type)
			addPrefixedField("Description", record.description)
			addPrefixedField("Values", record.values)
			addPrefixedField("History", record.history)
			addPrefixedField("Public Goal", record.publicGoal)
			addPrefixedField("Secret Goal", record.secretGoal)
			addPrefixedField("Public Perception", record.publicPerception)
			addPrefixedField("Resources", record.resources)
			// Consider adding summaries of key operations or culture elements
			break
		case "factionOperations":
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.type)
			addPrefixedField("Description", record.description)
			addPrefixedField("Objectives", record.objectives)
			break
		case "factionCulture":
			addPrefixedField("Symbols", record.symbols)
			addPrefixedField("Rituals", record.rituals)
			addPrefixedField("Taboos", record.taboos)
			addPrefixedField("Aesthetics", record.aesthetics)
			addPrefixedField("Jargon", record.jargon)
			break
		case "items": // Assuming 'items' table exists based on EmbeddedEntityName
			addPrefixedField("Name", record.name)
			addPrefixedField("Type", record.type)
			addPrefixedField("Description", record.description)
			addPrefixedField("Significance", record.significance)
			// Add other relevant item fields if they exist (e.g., history, powers)
			break
		case "clues": // Assuming 'clues' table exists
			addPrefixedField("Description", record.description)
			addPrefixedField("Reveals", record.reveals)
			// Add other relevant clue fields
			break
		case "siteEncounters":
			addPrefixedField("Name", record.name)
			addPrefixedField("Description", record.description)
			addPrefixedField("Creatures", record.creatures)
			addPrefixedField("Encounter Type", record.encounterType)
			addPrefixedField("Danger Level", record.dangerLevel)
			addPrefixedField("Treasure", record.treasure)
			break
		case "siteSecrets":
			addPrefixedField("Type", record.secretType)
			addPrefixedField("Description", record.description)
			addPrefixedField("Discovery Method", record.discoveryMethod)
			addPrefixedField("Consequences", record.consequences)
			addPrefixedField("Difficulty", record.difficultyToDiscover)
			break
		default:
			// Fallback: try to add all string/string array fields without prefix
			logger.warn(`No specific text generation logic defined for entity name: ${entityName}. Using generic approach.`)
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
