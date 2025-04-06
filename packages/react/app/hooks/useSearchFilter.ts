import { useMemo } from "react"

/**
 * A custom hook that filters an array of objects based on a search term
 *
 * @param data The array of objects to filter
 * @param searchTerm The search term to filter by
 * @returns Filtered array of objects that match the search term
 */
export function useSearchFilter<T>(data: T[], searchTerm: string): T[] {
	return useMemo(() => {
		if (!searchTerm.trim()) return data

		return data.filter((item) => {
			const term = searchTerm.toLowerCase()

			// Handle primitive arrays or undefined/null items
			if (!item || typeof item !== "object") {
				return String(item).toLowerCase().includes(term)
			}

			return Object.values(item as Record<string, unknown>).some((value) => {
				if (value === undefined || value === null) {
					return false
				}
				if (Array.isArray(value)) {
					return value.some((item) => {
						if (item === null || item === undefined) {
							return false
						}
						if (typeof item === "string") {
							return item.toLowerCase().includes(term)
						}
						return String(item).toLowerCase().includes(term)
					})
				}
				return value.toString().toLowerCase().includes(term)
			})
		})
	}, [data, searchTerm])
}
