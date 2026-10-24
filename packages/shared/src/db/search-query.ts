import { sql } from "drizzle-orm"

export type FullTextHit = {
	id: number
	source_table: string
	name: string
	slug: string
	score: number
}

/**
 * Full-text search across the `search_index` materialized view, ranked by `ts_rank_cd`
 * against the pre-computed `content_tsv`. This covers what entities say about themselves
 * and their relations; typo-tolerant matching on names is `createNameSearch`'s job.
 */
export const buildFullTextQuery = (searchTerm: string, limit = 10) => sql`
	SELECT
		s.id::INTEGER AS id,
		s.source_table,
		s.name,
		s.slug,
		ts_rank_cd(s.content_tsv, query)::FLOAT AS score
	FROM search_index s, plainto_tsquery('english', ${searchTerm}) AS query
	WHERE s.content_tsv @@ query
	ORDER BY score DESC
	LIMIT ${limit}
`
