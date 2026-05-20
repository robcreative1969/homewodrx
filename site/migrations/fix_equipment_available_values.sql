-- Migration: fix equipment_available values saved by the old onboarding flow
-- The companion-onboarding used space-separated strings; the canonical format
-- is snake_case matching profile.html's data-eq attributes.
-- Run this once in the Supabase SQL editor to fix any existing user data.

-- Value mapping (old → new):
--   "kettlebell"       → "kettlebells"
--   "pull-up bar"      → "pull_up_bar"
--   "assault bike"     → "bike"
--   "ski erg"          → "ski_erg"
--   "jump rope"        → "jump_rope"
--   "box"              → "plyo_box"
--   "wall ball"        → "wall_ball"
--   "medicine ball"    → "med_ball"
--   "slam ball"        → "slam_ball"
--   "resistance bands" → "resistance_bands"
--   "bodyweight only"  → "bodyweight_only"

UPDATE profiles
SET equipment_available = (
  SELECT array_agg(
    CASE val
      WHEN 'kettlebell'       THEN 'kettlebells'
      WHEN 'pull-up bar'      THEN 'pull_up_bar'
      WHEN 'assault bike'     THEN 'bike'
      WHEN 'ski erg'          THEN 'ski_erg'
      WHEN 'jump rope'        THEN 'jump_rope'
      WHEN 'box'              THEN 'plyo_box'
      WHEN 'wall ball'        THEN 'wall_ball'
      WHEN 'medicine ball'    THEN 'med_ball'
      WHEN 'slam ball'        THEN 'slam_ball'
      WHEN 'resistance bands' THEN 'resistance_bands'
      WHEN 'bodyweight only'  THEN 'bodyweight_only'
      ELSE val
    END
  )
  FROM unnest(equipment_available) AS val
)
WHERE equipment_available IS NOT NULL
  AND equipment_available && ARRAY[
    'kettlebell', 'pull-up bar', 'assault bike', 'ski erg',
    'jump rope', 'box', 'wall ball', 'medicine ball',
    'slam ball', 'resistance bands', 'bodyweight only'
  ];
