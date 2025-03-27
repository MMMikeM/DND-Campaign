import { toSlug } from "./slugs"

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
type RecursivelyWithSlugsAdded<T> =
	// Handle null/undefined
	T extends null | undefined
		? T
		: // Handle arrays
			T extends Array<infer U>
			? Array<RecursivelyWithSlugsAdded<U>>
			: // Handle objects but preserve primitives
				T extends object
				? {
						// For each property in the object, apply recursively
						[K in keyof T]: RecursivelyWithSlugsAdded<T[K]>
					} & // Add a slug if the object is sluggable
					(T extends Sluggable ? { slug: Slug } : Record<string, never>)
				: // Return primitives as is
					T

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
