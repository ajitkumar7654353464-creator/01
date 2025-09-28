/*
          # [Operation Name] Revert to Simple Pricing Model
          [This operation removes the tiered pricing system and reverts the database to use a simpler, single-rate model for buying and selling.]

          ## Query Description: [This script will permanently delete the `price_tiers` table. All tiered pricing data will be lost. The application will be configured to use the `app_config` table for a single buy rate and sell rate instead. Please ensure you have backed up any necessary data from the `price_tiers` table before proceeding.]
          
          ## Metadata:
          - Schema-Category: "Dangerous"
          - Impact-Level: "High"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - Table Dropped: `public.price_tiers`
          
          ## Security Implications:
          - RLS Status: Not Applicable
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: Removed with table
          - Triggers: None
          - Estimated Impact: Low. Simplifies pricing queries.
          */

DROP TABLE IF EXISTS public.price_tiers;
