-- Custom SQL migration file, put your code below! ---- Ensure required extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- Core fuzzy word match function (if not already created)
CREATE OR REPLACE FUNCTION fuzzy_word_match(
  content TEXT,
  search_term TEXT,
  similarity_threshold FLOAT DEFAULT 0.3,
  max_levenshtein_distance INT DEFAULT 2,
  phonetic_strength INT DEFAULT 4
)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
STRICT
AS $$
DECLARE
  word TEXT;
  word_list TEXT[];
  normalized_term TEXT;
BEGIN
  IF length(search_term) < 3 THEN
    RETURN content ILIKE '%' || search_term || '%';
  END IF;

  normalized_term := lower(trim(search_term));
  word_list := regexp_split_to_array(lower(content), E'[\\s\\.,;:!?\\-\\(\\)\\[\\]\\{\\}]+');

  FOREACH word IN ARRAY word_list LOOP
    IF length(word) >= 3 AND (
      word = normalized_term OR
      word LIKE normalized_term || '%' OR
      word LIKE '%' || normalized_term OR
      similarity(word, normalized_term) > similarity_threshold OR
      levenshtein(word, normalized_term) <= max_levenshtein_distance OR
      metaphone(word, phonetic_strength) = metaphone(normalized_term, phonetic_strength) OR
      word % normalized_term
    ) THEN
      RETURN TRUE;
    END IF;
  END LOOP;

  RETURN FALSE;
END;
$$;

-- 🔥 Main search function
CREATE OR REPLACE FUNCTION search_fuzzy_combined(
  search_term TEXT,
  threshold FLOAT DEFAULT 0.25,
  max_levenshtein INT DEFAULT 2,
  metaphone_strength INT DEFAULT 4
)
RETURNS TABLE (
  id INTEGER,
  source_table TEXT,
  raw_data JSONB,
  fts_score FLOAT,
  fuzzy_score FLOAT,
  final_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH
  fts AS (
    SELECT
      s.id,
      s.source_table,
      s.raw_data,
      ts_rank_cd(s.content_tsv, plainto_tsquery('english', search_term)) AS fts_score
    FROM search_index s
    WHERE s.content_tsv @@ plainto_tsquery('english', search_term)
  ),
  fuzzy AS (
    SELECT
      s.id,
      s.source_table,
      s.raw_data,
      similarity(s.content, search_term) AS fuzzy_score
    FROM search_index s
    WHERE fuzzy_word_match(
      s.content,
      search_term,
      threshold,
      max_levenshtein,
      metaphone_strength
    )
  )
  SELECT
    COALESCE(fts.id, fuzzy.id)::INTEGER AS id,
    COALESCE(fts.source_table, fuzzy.source_table)::TEXT AS source_table,
    COALESCE(fts.raw_data, fuzzy.raw_data)::JSONB AS raw_data,
    fts.fts_score::FLOAT,
    fuzzy.fuzzy_score::FLOAT,
    (COALESCE(fts.fts_score, 0) * 0.7 + COALESCE(fuzzy.fuzzy_score, 0) * 0.3)::FLOAT AS final_score
  FROM fts
  FULL OUTER JOIN fuzzy
    ON fts.id = fuzzy.id AND fts.source_table = fuzzy.source_table
  ORDER BY final_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;
