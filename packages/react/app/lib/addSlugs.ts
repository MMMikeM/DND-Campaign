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
 * Convert a slug back to a normal string format (not guaranteed to match original)
 * @param slug The slug to convert back to text
 */
export const fromSlug = (slug: string): string => {
	return slug
		.replace(/-/g, " ") // Replace hyphens with spaces
		.trim()
}

/**
 * Get a URL for an entity
 * @param type The entity type ('npcs', 'quests', 'regions', 'factions')
 * @param name The entity name
 * @param id The entity ID (optional, used for edit routes)
 */
export const getEntityUrl = (
	type: "npcs" | "quests" | "regions" | "factions",
	name: string,
	id?: number,
	action?: "edit" | "delete",
): string => {
	const slug = toSlug(name)

	if (action) {
		return `/${type}/${slug}/${action}`
	}

	return `/${type}/${slug}`
}

/**
 * Branded type for slugs to ensure type safety
 */
export type Slug = string & { readonly __brand: "Slug" }

/**
 * Creates a slug from a string
 */
export const createSlug = (text: string): Slug => {
	return toSlug(text) as Slug
}

/**
 * Type for objects with name and id that should receive a slug
 */
export interface Sluggable {
	name: string
	id: number
}

/**
 * Type with slug added
 */
export type WithSlug<T extends Sluggable> = T & { slug: Slug }

/**
 * Check if an object is a plain object (not null, not array, not Date, etc.)
 */
const isPlainObject = (item: unknown): item is Record<string, unknown> => {
	return item !== null && typeof item === "object" && !Array.isArray(item) && !(item instanceof Date)
}

/**
 * Type guard to check if an object should receive a slug
 */
function isSluggable(obj: Record<string, unknown>): obj is Sluggable & Record<string, unknown> {
	return "name" in obj && typeof obj.name === "string" && "id" in obj && typeof obj.id === "number"
}

/**
 * Helper for recursively applying the WithSlugsAdded transformation
 */
type RecursivelyWithSlugsAdded<T> = T extends null | undefined
	? T
	: T extends Array<infer U>
		? Array<RecursivelyWithSlugsAdded<U>>
		: T extends object
			? T extends Sluggable
				? { [K in keyof T]: RecursivelyWithSlugsAdded<T[K]> } & { slug: Slug }
				: { [K in keyof T]: RecursivelyWithSlugsAdded<T[K]> }
			: T

/**
 * Type that represents the result of adding slugs to objects
 */
export type WithSlugsAdded<T> = RecursivelyWithSlugsAdded<T>

/**
 * Recursively processes objects in data to add slugs where needed
 */
export function addSlugsRecursively<T>(data: T): WithSlugsAdded<T> {
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

		// Add slug if conditions are met
		if (isSluggable(result)) {
			result.slug = createSlug(result.name)
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
