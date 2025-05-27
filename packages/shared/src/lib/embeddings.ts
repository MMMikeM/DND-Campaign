const camelToTitle = (text: string) => {
	// Handle acronyms and camelCase properly
	// First, handle sequences of capital letters (acronyms) by keeping them together
	// Then handle normal camelCase transitions
	return text
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // Handle acronym followed by word (e.g., "XMLParser" -> "XML Parser")
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Handle normal camelCase (e.g., "camelCase" -> "camel Case")
		.replace(/([a-z])([0-9])/g, "$1 $2") // Handle letter followed by number
		.replace(/([0-9])([A-Z])/g, "$1 $2") // Handle number followed by capital letter
		.replace(/_/g, " ") // Replace underscores with spaces
		.replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
		.trim()
}

// Enhanced removeAppendedId to handle various ID suffix patterns
const removeAppendedId = (text: string | number | symbol) => {
	const str = String(text)

	// Special case: if the field is exactly "id", "ID", or "_id", don't modify it
	if (str.match(/^(id|ID|_id)$/)) {
		return camelToTitle(str)
	}

	// Handle various ID suffix patterns: Id, ID, _id (case-insensitive)
	const cleanStr = str.replace(/(Id|ID|_id)$/i, "").trim()

	// If cleaning results in an empty string, something went wrong, return original
	if (cleanStr === "") {
		return camelToTitle(str)
	}

	return camelToTitle(cleanStr)
}

// New simplified field configuration
interface EmbeddingFieldConfig {
	label?: string // Custom label for the field
	listItemType?: string // For arrays: what to call each item
	booleanTrueForm?: string // Custom text when boolean is true
	booleanFalseForm?: string // Custom text when boolean is false
}

// Legacy configuration type for backward compatibility
interface EmbeddingConfig {
	fieldConfig?: Record<
		string,
		{
			booleanTrueForm?: string
			booleanFalseForm?: string
			listItemTypeName?: string
		}
	>
}

// Helper function to format arrays with better semantic meaning
function formatListForEmbedding(arr: unknown[], label: string, itemTypeName?: string): string {
	const validItems = arr.filter((v) => typeof v === "string" && v.trim()) as string[]
	if (!validItems.length) return ""

	if (itemTypeName) {
		if (validItems.length === 1) {
			return `${label}: ${itemTypeName}: ${validItems[0]}`
		}

		// Check if items look like paragraphs (contain newlines or are very long)
		const areParagraphs = validItems.some((item) => item.includes("\n") || item.length > 100)

		if (areParagraphs) {
			// For paragraph-like content, use better spacing
			return `${label}:\n${validItems.map((item) => `- ${itemTypeName}: ${item}`).join("\n\n")}`
		}

		return `${label}:\n${validItems.map((item) => `- ${itemTypeName}: ${item}`).join("\n")}`
	}

	// For arrays without itemTypeName, check if they look like paragraphs
	const areParagraphs = validItems.some((item) => item.includes("\n") || item.length > 80)
	if (areParagraphs) {
		return `${label}:\n${validItems.join("\n\n")}`
	}

	return `${label}: ${validItems.join(". ")}`
}

/**
 * New simplified API for generating embedding text
 * @param record The data object
 * @param fieldConfigs Object mapping field names to their configuration
 */
export function getTextForEmbedding<T>(
	record: T,
	fieldConfigs: Record<string, EmbeddingFieldConfig | true>, // true means "include with default formatting"
) {
	return Object.entries(fieldConfigs)
		.map(([fieldName, config]) => {
			try {
				const value = (record as any)[fieldName]

				// Skip if value is null, undefined, or empty
				if (value == null || value === "") return ""

				// Skip empty arrays
				if (Array.isArray(value) && value.length === 0) return ""

				// Determine the label
				const label = config === true ? removeAppendedId(fieldName) : (config.label ?? removeAppendedId(fieldName))

				if (Array.isArray(value)) {
					const itemType = config === true ? undefined : config.listItemType
					return formatListForEmbedding(value, label, itemType)
				} else if (typeof value === "boolean") {
					if (config !== true && config.booleanTrueForm && value) {
						return `${label}: ${config.booleanTrueForm}`
					}
					if (config !== true && config.booleanFalseForm && !value) {
						return `${label}: ${config.booleanFalseForm}`
					}
					return `${label}: ${value ? "Yes" : "No"}`
				} else if (typeof value === "string" && value.trim()) {
					return `${label}: ${value}`
				} else if (value != null && value !== "") {
					return `${label}: ${value}`
				}
				return ""
			} catch (error) {
				// Graceful degradation - log error but don't break the entire embedding
				console.warn(`Error processing field ${fieldName}:`, error)
				return ""
			}
		})
		.filter(Boolean)
		.join("\n")
}

// Legacy function for backward compatibility (deprecated)
export function getTextForEmbeddingLegacy<T, K extends keyof T>(
	record: T,
	fields: K[],
	rename?: Partial<Record<K, string>>,
	config?: {
		fieldConfig?: Record<string, { booleanTrueForm?: string; booleanFalseForm?: string; listItemTypeName?: string }>
	},
) {
	// Convert to new format
	const fieldConfigs: Record<string, EmbeddingFieldConfig | true> = {}

	for (const field of fields) {
		const fieldStr = String(field)
		const fieldConfig = config?.fieldConfig?.[fieldStr]

		if (fieldConfig || rename?.[field]) {
			fieldConfigs[fieldStr] = {
				label: rename?.[field],
				listItemType: fieldConfig?.listItemTypeName,
				booleanTrueForm: fieldConfig?.booleanTrueForm,
				booleanFalseForm: fieldConfig?.booleanFalseForm,
			}
		} else {
			fieldConfigs[fieldStr] = true
		}
	}

	return getTextForEmbedding(record, fieldConfigs)
}
