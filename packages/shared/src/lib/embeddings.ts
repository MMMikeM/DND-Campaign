import { type EmbeddedEntityName, logger } from "../embeddings"
import { embeddingTextGenerators } from "../schemas"

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
const camelToTitle = (text: string) => {
	return text.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}
const removeAppendedId = (text: string | number | symbol) => camelToTitle(String(text).replace(/id/i, "").trim())

export function getTextForEmbedding<T extends Record<string, unknown>, K extends keyof T>(
	record: T,
	fields: K[],
	rename?: Partial<Record<K, string>>,
) {
	return fields
		.map((field) => {
			const label = removeAppendedId(rename?.[field] ?? field)
			const value = record[field]
			if (Array.isArray(value)) {
				const arr = value.filter((v) => typeof v === "string" && v.trim())
				if (arr.length) return `${label}: ${arr.join(". ")}`
				return ""
			} else if (typeof value === "string" && value.trim()) {
				return `${label}: ${value}`
			} else if (value != null) {
				return `${label}: ${value}`
			}
			return ""
		})
		.filter(Boolean)
		.join("\n")
}
