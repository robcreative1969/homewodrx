-- Migration: add dumbbell_weights and kettlebell_weights to profiles
-- These store the specific weights (in lbs) the user owns, as integer arrays.
-- Example: dumbbell_weights = {10,15,25,35} means they own 10, 15, 25, and 35 lb dumbbells.
-- Used by the AI Companion to prescribe specific weights rather than generic "grab a dumbbell".

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS dumbbell_weights  integer[],
  ADD COLUMN IF NOT EXISTS kettlebell_weights integer[];

-- No default needed — NULL means "not specified" which is handled gracefully
-- in the Edge Function (falls back to generic equipment language).
