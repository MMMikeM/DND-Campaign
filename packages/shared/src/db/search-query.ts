import { sql } from "drizzle-orm"

export type FullTextHit = {
	id: number
	source_table: string
	name: string
	slug: string
	score: number
}

/**
 * `searchTerm` with each word that matches nothing replaced by the closest word an entity uses: a trigram or sound-alike
 * (`dmetaphone`) match, then the fewest edits, then the word the most entities use. A word of four letters or fewer
 * has too many neighbours to guess between, so it is replaced only when one candidate is closest.
 */
const correctedTerm = (searchTerm: string) => sql`
	SELECT string_agg(coalesce(best.word, typed.word), ' ' ORDER BY typed.position)
	-- Not regexp_split_to_table: the planner guesses 1000 rows for it, which tips the plan past
	-- jit_above_cost and spends ~5 ms compiling every search.
	FROM unnest(regexp_split_to_array(lower(${searchTerm}), '[^[:alnum:]]+')) WITH ORDINALITY AS typed(word, position)
	LEFT JOIN LATERAL (
		SELECT e.word, count(*) OVER (PARTITION BY levenshtein(e.word, typed.word)) AS tied
		FROM entity_words e
		WHERE typed.word ~ '^[[:alpha:]]{3,}$'
			AND NOT EXISTS (SELECT FROM entity_words known WHERE known.word = typed.word)
			AND NOT EXISTS (SELECT FROM search_index s WHERE s.content_tsv @@ plainto_tsquery('english', typed.word))
			AND (e.word % typed.word OR e.sound = dmetaphone(typed.word))
		ORDER BY levenshtein(e.word, typed.word), e.ndoc DESC, similarity(e.word, typed.word) DESC, e.word
		LIMIT 1
	) best ON length(typed.word) > 4 OR best.tied = 1
`

/**
 * Full-text search across the `search_index` materialized view, ranked by `ts_rank_cd`
 * against the pre-computed `content_tsv`. This covers what entities say about themselves
 * and their relations, after correcting misspelled words; typo-tolerant matching on names is `createNameSearch`'s job.
 *
 * `tables` restricts the hits to those source tables before the limit applies; omit it to search them all.
 */
export const buildFullTextQuery = (searchTerm: string, limit = 10, tables?: readonly string[]) => sql`
	SELECT
		s.id::INTEGER AS id,
		s.source_table,
		s.name,
		s.slug,
		ts_rank_cd(s.content_tsv, query)::FLOAT AS score
	FROM search_index s, plainto_tsquery('english', (${correctedTerm(searchTerm)})) AS query
	WHERE s.content_tsv @@ query
	${tables ? sql`AND s.source_table = ANY(${sql.param(tables)}::text[])` : sql``}
	ORDER BY score DESC
	LIMIT ${limit}
`
