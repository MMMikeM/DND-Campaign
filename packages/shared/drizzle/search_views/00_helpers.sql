-- Helper Functions for Search Index View

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
      val := val || ' ' || jsonb_deep_text_values(elem);
    END LOOP;
  ELSIF jsonb_typeof(j) = 'array' THEN
    -- For arrays, process each element recursively
    FOR elem IN SELECT * FROM jsonb_array_elements(j) LOOP
      val := val || ' ' || jsonb_deep_text_values(elem);
    END LOOP;
  ELSIF jsonb_typeof(j) = 'string' THEN
    -- For strings, extract the text value directly, removing quotes
    val := val || ' ' || trim(both '"' FROM j::text);
  ELSIF jsonb_typeof(j) IN ('number', 'boolean', 'null') THEN
     -- Convert other primitives to text
     val := val || ' ' || j::text;
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
  primary_text := jsonb_deep_text_values(primary_json);
  result_vector := setweight(to_tsvector(config, primary_text), 'A');

  -- If secondary JSON is provided, add with weight B (lower importance)
  IF secondary_json IS NOT NULL THEN
    secondary_text := jsonb_deep_text_values(secondary_json);
    result_vector := result_vector || setweight(to_tsvector(config, secondary_text), 'B');
  END IF;

  RETURN result_vector;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
