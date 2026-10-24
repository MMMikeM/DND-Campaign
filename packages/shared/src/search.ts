import { createFuzzySearch } from "ekrina"

/** An entity as search shows it: enough to rank by name and link to its page. */
export type EntityRef = {
	id: number
	table: string
	name: string
	slug: string
}

export type SearchResult = EntityRef & { matchedBy: "name" | "text" }

/**
 * Ranks entities by name with ekrina: tiered matches (exact, prefix, word boundary,
 * contains) and one-edit typo rescue. Runs in the browser or on the server; build it
 * once per name list, since each call to the returned function takes well under 1ms.
 */
export const createNameSearch = (entities: EntityRef[]) => {
	const search = createFuzzySearch(entities, (entity) => entity.name)
	return (term: string): EntityRef[] => search(term).map(({ item }) => item)
}

/** Name matches lead because they are what was typed; full-text hits follow, minus any already listed. */
export const mergeSearchResults = (nameHits: EntityRef[], textHits: EntityRef[], limit: number): SearchResult[] => {
	const seen = new Set<string>()
	const results: SearchResult[] = []
	const add = (hits: EntityRef[], matchedBy: SearchResult["matchedBy"]) => {
		for (const hit of hits) {
			const key = `${hit.table}:${hit.id}`
			if (results.length >= limit || seen.has(key)) continue
			seen.add(key)
			results.push({ ...hit, matchedBy })
		}
	}
	add(nameHits, "name")
	add(textHits, "text")
	return results
}
