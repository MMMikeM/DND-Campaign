import { stringify } from "yaml"

// Simple key mapping type for overrides only
export type KeyMapping = Record<string, string>

// Convert camelCase or snake_case to Title Case
function toTitleCase(key: string): string {
	return key
		.replace(/([A-Z])/g, " $1") // Add space before capital letters
		.replace(/_/g, " ") // Replace underscores with spaces
		.replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
		.replace(/\s+/g, " ") // Clean up multiple spaces
		.trim()
}

// Capitalize the first letter of a string value and convert object keys to Title Case
function capitalizeValue(value: unknown): unknown {
	if (typeof value === "string") {
		const cleaned = value.replace(/_/g, " ")
		return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
	}
	if (Array.isArray(value)) {
		return value.map(capitalizeValue)
	}
	if (value && typeof value === "object" && value.constructor === Object) {
		const transformed: Record<string, unknown> = {}
		for (const [key, val] of Object.entries(value)) {
			if (val !== undefined && val !== null && val !== "") {
				// Convert the key to Title Case and recursively process the value
				const titleCaseKey = toTitleCase(key)
				transformed[titleCaseKey] = capitalizeValue(val)
			}
		}
		return Object.keys(transformed).length > 0 ? transformed : undefined
	}
	return value
}

// Check if a value should be included (not empty)
function shouldInclude(value: unknown): boolean {
	if (value === undefined || value === null) return false
	if (typeof value === "string") return value.trim() !== ""
	if (Array.isArray(value)) return value.length > 0
	if (typeof value === "object") return Object.keys(value).length > 0
	return true
}

// New simplified buildEmbedding function
export function buildEmbedding(entity: Record<string, unknown>, keyMappings: KeyMapping = {}): string {
	// Destructure and filter the entity to only include defined, non-empty values
	const cleanEntity: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(entity)) {
		if (shouldInclude(value)) {
			// Use explicit mapping if provided, otherwise auto-convert to title case
			const transformedKey = keyMappings[key] || toTitleCase(key)
			const transformedValue = capitalizeValue(value)
			if (transformedValue !== undefined) {
				cleanEntity[transformedKey] = transformedValue
			}
		}
	}

	return stringify(cleanEntity, {
		indent: 2,
		lineWidth: 0, // Disable line wrapping
		minContentWidth: 0,
		doubleQuotedAsJSON: false,
	})
}
