import { sql } from "drizzle-orm"

export type SimilarityHit = {
	id: number
	source_table: string
	raw_data: Record<string, unknown>
	fts_score: number | null
	fuzzy_score: number | null
	final_score: number
}

/**
 * Centralized fuzzy search across the `search_index` materialized view.
 *
 * Blends two ranking signals over the same rows:
 *  - full-text: `ts_rank_cd` against the pre-computed `content_tsv`
 *  - fuzzy: trigram similarity, gated by a per-word match (prefix/suffix,
 *    trigram, Levenshtein distance, and metaphone phonetic equality)
 *
 * Requires the `pg_trgm` and `fuzzystrmatch` extensions.
 *
 * @param searchTerm - The term to search for
 * @param fuzzyWeight - Multiplier on the fuzzy arm's contribution (default: 1.0)
 * @param similarityThreshold - Minimum trigram similarity for a word to match (default: 0.3)
 * @param maxLevenshtein - Maximum Levenshtein distance for a word to match (default: 2)
 * @param phoneticStrength - Metaphone code length used for phonetic matching (default: 2)
 * @param limit - Maximum number of results to return (default: 10)
 */
export const buildSimilarityQuery = (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 2,
	limit = 10,
) => {
	const term = sql`${searchTerm}`
	const normalized = sql`lower(trim(${searchTerm}))`
	const query = sql`plainto_tsquery('english', ${searchTerm})`

	// Replaces the old plpgsql `fuzzy_word_match` loop: split the row's content
	// into words and look for any single word that matches the term.
	const wordMatches = sql`
		CASE WHEN length(${term}) < 3 THEN
			s.content ILIKE '%' || ${term} || '%'
		ELSE EXISTS (
			SELECT 1
			FROM unnest(
				regexp_split_to_array(lower(s.content), '[\\s\\.,;:!?\\-\\(\\)\\[\\]\\{\\}]+')
			) AS w
			WHERE length(w) >= 3 AND (
				w = ${normalized}
				OR w LIKE ${normalized} || '%'
				OR w LIKE '%' || ${normalized}
				OR similarity(w, ${term}) > ${similarityThreshold}
				OR levenshtein(w, ${term}) <= ${maxLevenshtein}
				OR metaphone(w, ${phoneticStrength}) = metaphone(${term}, ${phoneticStrength})
				OR w % ${term}
			)
		) END
	`

	return sql`
		WITH fts AS (
			SELECT s.id, s.source_table, s.raw_data,
				ts_rank_cd(s.content_tsv, ${query}) AS fts_score
			FROM search_index s
			WHERE s.content_tsv @@ ${query}
		),
		fuzzy AS (
			SELECT s.id, s.source_table, s.raw_data,
				similarity(s.content, ${term}) AS fuzzy_score
			FROM search_index s
			WHERE ${wordMatches}
		)
		SELECT
			COALESCE(fts.id, fuzzy.id)::INTEGER AS id,
			COALESCE(fts.source_table, fuzzy.source_table)::TEXT AS source_table,
			COALESCE(fts.raw_data, fuzzy.raw_data)::JSONB AS raw_data,
			fts.fts_score::FLOAT AS fts_score,
			fuzzy.fuzzy_score::FLOAT AS fuzzy_score,
			(
				COALESCE(fts.fts_score, 0) * 0.7
				+ COALESCE(fuzzy.fuzzy_score, 0) * 0.3 * ${fuzzyWeight}
			)::FLOAT AS final_score
		FROM fts
		FULL OUTER JOIN fuzzy
			ON fts.id = fuzzy.id AND fts.source_table = fuzzy.source_table
		ORDER BY final_score DESC
		LIMIT ${limit}
	`
}
