-- Migration: Add Search Indexes for Advanced Artist Search
-- Date: 2025-10-01
-- Description: Add full-text search indexes and trigram extension for artist search

-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add full-text search column for artists (French language)
ALTER TABLE artists ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update search_vector
CREATE OR REPLACE FUNCTION artists_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', coalesce(NEW."artisticBio", '')), 'A') ||
    setweight(to_tsvector('french', coalesce(array_to_string(NEW.genres, ' '), '')), 'B') ||
    setweight(to_tsvector('french', coalesce(array_to_string(NEW.instruments, ' '), '')), 'C') ||
    setweight(to_tsvector('french', coalesce(array_to_string(NEW.specialties, ' '), '')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update search_vector
DROP TRIGGER IF EXISTS artists_search_vector_trigger ON artists;
CREATE TRIGGER artists_search_vector_trigger
  BEFORE INSERT OR UPDATE ON artists
  FOR EACH ROW
  EXECUTE FUNCTION artists_search_vector_update();

-- Update existing rows
UPDATE artists SET search_vector =
  setweight(to_tsvector('french', coalesce("artisticBio", '')), 'A') ||
  setweight(to_tsvector('french', coalesce(array_to_string(genres, ' '), '')), 'B') ||
  setweight(to_tsvector('french', coalesce(array_to_string(instruments, ' '), '')), 'C') ||
  setweight(to_tsvector('french', coalesce(array_to_string(specialties, ' '), '')), 'D');

-- Create GIN index for full-text search (best performance for tsvector)
CREATE INDEX IF NOT EXISTS idx_artists_search_vector ON artists USING gin(search_vector);

-- Create GIN indexes for array fields (genres, instruments)
CREATE INDEX IF NOT EXISTS idx_artists_genres_gin ON artists USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_artists_instruments_gin ON artists USING gin(instruments);

-- Create trigram indexes for fuzzy search on text fields
CREATE INDEX IF NOT EXISTS idx_artists_bio_trigram ON artists USING gin("artisticBio" gin_trgm_ops);

-- Create indexes for common filters
CREATE INDEX IF NOT EXISTS idx_artists_public ON artists("isPublic") WHERE "isPublic" = true;
CREATE INDEX IF NOT EXISTS idx_artists_experience ON artists(experience);
CREATE INDEX IF NOT EXISTS idx_artists_price_range ON artists("priceRange");
CREATE INDEX IF NOT EXISTS idx_artists_created_at ON artists("createdAt" DESC);

-- Create composite index for popular queries
CREATE INDEX IF NOT EXISTS idx_artists_public_created ON artists("isPublic", "createdAt" DESC) WHERE "isPublic" = true;

-- Add index on Profile location for distance-based search
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location) WHERE location IS NOT NULL;

-- Add index on metrics for popularity-based sorting
CREATE INDEX IF NOT EXISTS idx_metrics_views ON artist_metrics("profileViews" DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_clicks ON artist_metrics("searchClicks" DESC);

-- Create materialized view for popular searches (future optimization)
-- We'll implement this later if needed for caching

COMMENT ON INDEX idx_artists_search_vector IS 'Full-text search index for artist search queries';
COMMENT ON INDEX idx_artists_genres_gin IS 'GIN index for genre filtering';
COMMENT ON INDEX idx_artists_instruments_gin IS 'GIN index for instrument filtering';
COMMENT ON INDEX idx_artists_bio_trigram IS 'Trigram index for fuzzy text matching on bio';
