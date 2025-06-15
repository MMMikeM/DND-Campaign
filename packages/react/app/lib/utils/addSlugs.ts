/**
 * Convert a string to a URL-friendly slug
 * @param text The text to convert to a slug
 */
export const toSlug = (text: string): string => {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove special characters except whitespace and hyphen
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
		.trim()
}

/**
 * Branded type for slugs to ensure type safety
 */
export type Slug = string

/**
 * Creates a slug from a string
 */
export const createSlug = (text: string): Slug => {
	return toSlug(text) as Slug
}

/**
 * Base type for objects with an ID.
 */
interface Identifiable {
	id: number
}

/**
 * Type for objects sluggable by name.
 */
interface SluggableByName extends Identifiable {
	name: string
}

/**
 * Type for objects that should receive a slug (only by name).
 */
type Sluggable = SluggableByName

/**
 * Type with slug added to an identifiable object.
 */
export type WithSlug<T extends Identifiable> = T & { slug?: Slug }

/**
 * Check if an object is a plain object (not null, not array, not Date, etc.)
 */
const isPlainObject = (item: unknown): item is Record<string, unknown> => {
	return item !== null && typeof item === "object" && !Array.isArray(item) && !(item instanceof Date)
}

/**
 * Type guard to check if an object should receive a slug (has id and either name or title).
 */
function isSluggable(obj: Record<string, unknown>): obj is Sluggable & Record<string, unknown> {
	const hasId = "id" in obj && typeof obj.id === "number"
	const hasName = "name" in obj && typeof obj.name === "string"
	// Only check for name now
	return hasId && hasName
}

/**
 * Simplified type that represents the result of adding slugs to objects
 * This avoids the complex recursive type that was causing TypeScript to expand the Slug type
 */
export type WithSlugsAdded<T> = T extends (infer U)[]
	? WithSlugsAdded<U>[]
	: T extends object
		? T extends Sluggable
			? { [K in keyof T]: WithSlugsAdded<T[K]> } & { slug: Slug }
			: { [K in keyof T]: WithSlugsAdded<T[K]> }
		: T

/**
 * Recursively processes objects in data to add slugs where needed
 */
function addSlugsRecursively<T>(data: T): WithSlugsAdded<T> {
	// Handle null/undefined case
	if (data === null || data === undefined) {
		return data as WithSlugsAdded<T>
	}

	// Handle array case
	if (Array.isArray(data)) {
		return data.map((item) => addSlugsRecursively(item)) as WithSlugsAdded<T>
	}

	// Handle object case
	if (isPlainObject(data)) {
		const result = { ...data } as Record<string, unknown>

		// Add slug if conditions are met (has id and name)
		if (isSluggable(result)) {
			// Use name for slug source
			const slugSource = result.name
			if (slugSource) {
				result.slug = createSlug(slugSource)
			}
		}

		// Process all properties recursively
		for (const key in result) {
			// @ts-ignore TypeScript < ES2022 compatibility
			if (Object.hasOwn(result, key)) {
				result[key] = addSlugsRecursively(result[key])
			}
		}

		return result as WithSlugsAdded<T>
	}

	// Return primitives as is
	return data as WithSlugsAdded<T>
}

/**
 * Recursively adds slugs to all objects in the data structure that have name+id
 * @param data The data structure to process
 */
export default function addSlugs<T>(data: T): WithSlugsAdded<T> {
	return addSlugsRecursively(data)
}
