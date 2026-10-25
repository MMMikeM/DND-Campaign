import { buildFullTextQuery, type FullTextHit, selectEntityNames } from "@tome-master/shared/db"
import { createNameSearch, type EntityRef, mergeSearchResults, type SearchResult } from "@tome-master/shared/search"
import { sql } from "drizzle-orm"
import { db } from "../.."

let nameSearch: Promise<(term: string) => EntityRef[]> | undefined

const getNameSearch = () => {
	nameSearch ??= selectEntityNames(db).then(createNameSearch)
	return nameSearch
}

/**
 * mcp is the only process that writes, so a write here is the only thing that can
 * make the cached names, `search_index` or `entity_words` stale. Call it after every one.
 */
export const invalidateSearch = async () => {
	nameSearch = undefined
	await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY search_index`)
	await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY entity_words`)
}

/** Entities matching by name (typo-tolerant), then by what they say about themselves. */
export const searchEntities = async (term: string, limit = 10): Promise<SearchResult[]> => {
	const [searchNames, { rows }] = await Promise.all([
		getNameSearch(),
		db.execute<FullTextHit>(buildFullTextQuery(term, limit)),
	])
	const textHits = rows.map(({ id, source_table, name, slug }) => ({ id, table: source_table, name, slug }))
	return mergeSearchResults(searchNames(term), textHits, limit)
}
