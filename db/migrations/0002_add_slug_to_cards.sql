-- Add slug field to cards table for HN ingestion
ALTER TABLE cards ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);

-- Add index for source_tags array
CREATE INDEX IF NOT EXISTS idx_cards_source_tags ON cards USING GIN(source_tags);

-- Insert migration record
INSERT INTO schema_migrations (version, applied_at) VALUES ('0002_add_slug_to_cards', CURRENT_TIMESTAMP);
