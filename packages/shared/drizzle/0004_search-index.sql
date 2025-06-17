-- Custom SQL migration file, put your code below! --
-- Ensure this is created *before* attempting concurrent refreshes.
CREATE UNIQUE INDEX IF NOT EXISTS idx_search_index_unique ON search_index (id, source_table);

-- GIN index for trigram fuzzy search on the 'content' column
CREATE INDEX IF NOT EXISTS idx_search_index_content_trgm ON search_index USING GIN (content gin_trgm_ops);

-- GIN index for full-text search on the 'content_tsv' column
CREATE INDEX IF NOT EXISTS idx_search_index_tsv ON search_index USING GIN (content_tsv);