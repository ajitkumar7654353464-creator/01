/*
# Create Price Tiers Table
This migration creates a new table `price_tiers` to manage dynamic, tiered pricing for buying and selling USDT. It also populates the table with initial values.

## Query Description: 
This operation is structural and safe. It creates a new table `price_tiers` for storing different price levels based on transaction volume and inserts default pricing data. No existing data will be affected.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the table can be dropped)

## Structure Details:
- Creates table: `public.price_tiers`
- Columns: `id`, `label`, `min_quantity`, `max_quantity`, `price`, `tier_type`, `created_at`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes (A new read-only policy is created for this table)
- Auth Requirements: None for reading.

## Performance Impact:
- Indexes: A primary key is added.
- Triggers: None.
- Estimated Impact: Negligible.
*/

-- Create the price_tiers table
CREATE TABLE public.price_tiers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    label text NOT NULL,
    min_quantity numeric NOT NULL,
    max_quantity numeric NULL,
    price numeric NOT NULL,
    tier_type text NOT NULL CHECK (tier_type IN ('buy', 'sell')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT price_tiers_pkey PRIMARY KEY (id)
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.price_tiers IS 'Stores tiered pricing for buying and selling assets.';
COMMENT ON COLUMN public.price_tiers.label IS 'Display label for the tier, e.g., ''0-50''.';
COMMENT ON COLUMN public.price_tiers.min_quantity IS 'The minimum quantity for this tier to apply.';
COMMENT ON COLUMN public.price_tiers.max_quantity IS 'The maximum quantity for this tier. NULL indicates no upper limit.';
COMMENT ON COLUMN public.price_tiers.price IS 'The price per unit for this tier.';
COMMENT ON COLUMN public.price_tiers.tier_type IS 'Distinguishes between buy and sell price tiers.';

-- Enable Row Level Security
ALTER TABLE public.price_tiers ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read-access to price tiers"
ON public.price_tiers
FOR SELECT
USING (true);

-- Insert initial data for BUYING prices based on the image
INSERT INTO public.price_tiers (label, min_quantity, max_quantity, price, tier_type) VALUES
('0-50', 0, 50, 86.00, 'buy'),
('50-100', 50, 100, 85.50, 'buy'),
('100-200', 100, 200, 85.00, 'buy'),
('200-500', 200, 500, 84.50, 'buy'),
('500-1000', 500, 1000, 84.00, 'buy'),
('1000+', 1000, NULL, 83.50, 'buy');

-- Insert initial data for SELLING prices (example values)
INSERT INTO public.price_tiers (label, min_quantity, max_quantity, price, tier_type) VALUES
('0-50', 0, 50, 83.00, 'sell'),
('50-100', 50, 100, 82.50, 'sell'),
('100-200', 100, 200, 82.00, 'sell'),
('200-500', 200, 500, 81.50, 'sell'),
('500-1000', 500, 1000, 81.00, 'sell'),
('1000+', 1000, NULL, 80.50, 'sell');
