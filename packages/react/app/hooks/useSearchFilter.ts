import { createFuzzySearch, SCORES } from "ekrina"
import { useMemo } from "react"

const getSearchableValues = (data: unknown, isTopLevel = true): { topLevel: string[]; nested: string[] } => {
	if (!data) {
		return { topLevel: [], nested: [] }
	}

	if (Array.isArray(data)) {
		return mergeValues(data.map((item) => getSearchableValues(item, false)))
	}

	if (typeof data === "object") {
		return mergeValues(
			Object.entries(data).map(([key, value]) => {
				if (["id", "slug"].includes(key)) return { topLevel: [], nested: [] } // Ignore common non-searchable keys
				const nestedValues = getSearchableValues(value, false)
				// Anything reached through a nested object stays nested, however deep
				return isTopLevel ? nestedValues : { topLevel: [], nested: [...nestedValues.topLevel, ...nestedValues.nested] }
			}),
		)
	}

	const value = String(data)
	return isTopLevel ? { topLevel: [value], nested: [] } : { topLevel: [], nested: [value] }
}

const mergeValues = (parts: { topLevel: string[]; nested: string[] }[]) => ({
	topLevel: parts.flatMap((part) => part.topLevel),
	nested: parts.flatMap((part) => part.nested),
})

const joinValues = (values: string[]) => (values.length > 0 ? values.join("\n") : null)

/**
 * A custom hook that filters an array of objects based on a search term using fuzzy matching.
 * It searches through all string values in the objects, ranking nested properties lower.
 *
 * @param data The array of objects to filter.
 * @param searchTerm The search term to filter by.
 * @returns A filtered array of objects that match the search term, best match first.
 */
export function useSearchFilter<T extends Record<string, unknown>>(data: T[], searchTerm: string): T[] {
	const search = useMemo(
		() =>
			createFuzzySearch(data, [
				{ text: (item) => joinValues(getSearchableValues(item).topLevel) },
				// Nested values can never outrank a top-level hit
				{ text: (item) => joinValues(getSearchableValues(item).nested), atBest: SCORES.CONTAINS },
			]),
		[data],
	)

	return useMemo(() => {
		if (!searchTerm.trim()) {
			return data
		}

		return search(searchTerm).map(({ item }) => item)
	}, [data, search, searchTerm])
}
