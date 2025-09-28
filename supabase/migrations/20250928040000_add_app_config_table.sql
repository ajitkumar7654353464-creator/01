/*
          # [Create App Configuration Table]
          This migration creates a new table `app_config` to store key-value application settings, such as USDT buy and sell rates. This allows for dynamic configuration of rates without code changes.

          ## Query Description: 
          - Creates the `app_config` table with `key` and `value` columns.
          - Inserts default values for `buy_rate_usdt` (85) and `sell_rate_usdt` (84).
          - Enables Row Level Security (RLS) and adds a policy to allow all authenticated users to read these settings.
          - This operation is safe and will not affect existing data.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table Created: `public.app_config`
          - Columns: `key` (text, primary key), `value` (text), `created_at` (timestamptz)
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Adds a read policy for authenticated users)
          - Auth Requirements: Authenticated users can read.
          
          ## Performance Impact:
          - Indexes: Primary key index on `key`.
          - Triggers: None
          - Estimated Impact: Negligible.
          */

CREATE TABLE public.app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read the configuration
CREATE POLICY "Allow authenticated users to read config"
ON public.app_config
FOR SELECT
TO authenticated
USING (true);

-- Insert initial rates
INSERT INTO public.app_config (key, value) VALUES
('buy_rate_usdt', '85.00'),
('sell_rate_usdt', '84.00');
