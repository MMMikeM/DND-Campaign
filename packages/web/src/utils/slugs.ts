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
 * @param type The entity type ('npcs', 'quests', 'locations', 'factions')
 * @param name The entity name
 * @param id The entity ID (optional, used for edit routes)
 */
export const getEntityUrl = (
	type: "npcs" | "quests" | "locations" | "factions",
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
