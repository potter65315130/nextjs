-- Migration: Add review and rating columns to applications table
-- Date: 2025-12-22
-- Description: Add review (TEXT) and rating (INT) columns to support shop owner reviews

-- Add review and rating columns
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS review TEXT,
ADD COLUMN IF NOT EXISTS rating INTEGER;

-- Add check constraint for rating (1-5)
ALTER TABLE applications 
ADD CONSTRAINT rating_range CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));

-- Verify the migration
-- Run this query to check the columns were added:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'applications' AND column_name IN ('review', 'rating');
