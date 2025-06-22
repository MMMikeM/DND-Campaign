import { search } from "fast-fuzzy"
import { useMemo } from "react"

const getSearchableValues = (data: unknown, isTopLevel = true): string[] => {
	if (!data) {
		return []
	}

	if (Array.isArray(data)) {
		return data.flatMap((item) => getSearchableValues(item, false))
	}

	if (typeof data === "object") {
		return Object.entries(data).flatMap(([key, value]) => {
			if (["id", "slug"].includes(key)) return [] // Ignore common non-searchable keys
			const nestedValues = getSearchableValues(value, false)
			return isTopLevel ? nestedValues : nestedValues.map((v) => `_${v}`) // Prepend underscore to nested values
		})
	}

	const value = String(data)
	return isTopLevel ? [value] : [`_${value}`]
}

const customScorer = (text: string, query: string) => {
	let score = 0
	const penalty = text.startsWith("_") ? 0.5 : 0 // Apply penalty for nested values

	// A simple scoring algorithm, can be improved
	if (text.toLowerCase().includes(query.toLowerCase())) {
		score = query.length / text.length - penalty
	}

	return score
}

/**
 * A custom hook that filters an array of objects based on a search term using fuzzy matching.
 * It searches through all string values in the objects, ranking nested properties lower.
 *
 * @param data The array of objects to filter.
 * @param searchTerm The search term to filter by.
 * @returns A filtered array of objects that match the search term.
 */
export function useSearchFilter<T extends Record<string, unknown>>(data: T[], searchTerm: string): T[] {
	return useMemo(() => {
		if (!searchTerm.trim()) {
			return data
		}

		return search(searchTerm, data, {
			keySelector: (obj) => getSearchableValues(obj),
			scorer: customScorer,
			threshold: 0.7, // Adjust threshold for custom scorer
		})
	}, [data, searchTerm])
}
