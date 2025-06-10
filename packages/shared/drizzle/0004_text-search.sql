CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;


-- Recursively extracts all text values from a JSONB structure
CREATE OR REPLACE FUNCTION jsonb_deep_text_values(j jsonb)
RETURNS TEXT AS $$
DECLARE
  val TEXT := '';
  elem jsonb;
BEGIN
  IF jsonb_typeof(j) = 'object' THEN
    -- For objects, process each value recursively (ignore keys)
    FOR elem IN SELECT value FROM jsonb_each(j) LOOP
      -- Explicitly qualify recursive call with schema
      val := val || ' ' || public.jsonb_deep_text_values(elem);
    END LOOP;
  ELSIF jsonb_typeof(j) = 'array' THEN
    -- For arrays, process each element recursively
    FOR elem IN SELECT * FROM jsonb_array_elements(j) LOOP
      -- Explicitly qualify recursive call with schema
      val := val || ' ' || public.jsonb_deep_text_values(elem);
    END LOOP;
  ELSIF jsonb_typeof(j) = 'string' THEN
    -- For strings, extract the text value directly, removing quotes
    val := val || ' ' || trim(both '"' FROM j::text);
  -- ELSE: Ignore numbers, booleans, and nulls by not having an ELSIF for them
  END IF;

  -- Trim leading/trailing spaces from the final result
  RETURN trim(val);
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- Creates a weighted tsvector from primary (A) and optional secondary (B) JSONB data
CREATE OR REPLACE FUNCTION weighted_search_vector(
  primary_json JSONB,
  secondary_json JSONB DEFAULT NULL,
  config regconfig DEFAULT 'english' -- Allow specifying text search config
) RETURNS TSVECTOR AS $$
DECLARE
  primary_text TEXT;
  secondary_text TEXT;
  result_vector TSVECTOR;
BEGIN
  -- Get all text values from primary JSON with weight A (highest importance)
  -- Explicitly qualify function call with schema
  primary_text := public.jsonb_deep_text_values(primary_json);
  result_vector := setweight(to_tsvector(config, primary_text), 'A');

  -- If secondary JSON is provided, add with weight B (lower importance)
  IF secondary_json IS NOT NULL THEN
    -- Explicitly qualify function call with schema
    secondary_text := public.jsonb_deep_text_values(secondary_json);
    result_vector := result_vector || setweight(to_tsvector(config, secondary_text), 'B');
  END IF;

  RETURN result_vector;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
-- View for aggregating region data for the search index

