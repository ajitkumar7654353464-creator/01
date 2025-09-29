/*
          # Create and Seed Buying Prices Table
          This migration creates a new table 'buying_prices' to store tiered pricing information for buying USDT. It also seeds the table with initial data.

          ## Query Description: 
          - Creates the 'buying_prices' table for a tiered pricing structure.
          - Enables Row Level Security (RLS) on the new table.
          - Adds a policy to allow public read access to the price tiers.
          - Inserts six initial pricing tiers for different USDT quantities.
          This operation is safe and does not affect existing data, as it only adds a new table.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: public.buying_prices
          - Columns: id, quantity_range, price_inr, sort_order, created_at
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (adds a read-only policy for anon and authenticated users)
          - Auth Requirements: None for reading data.
          
          ## Performance Impact:
          - Indexes: Primary key on 'id', Unique constraint on 'sort_order'.
          - Triggers: None
          - Estimated Impact: Negligible performance impact.
          */

CREATE TABLE public.buying_prices (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    quantity_range text NOT NULL,
    price_inr numeric NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT buying_prices_pkey PRIMARY KEY (id),
    CONSTRAINT buying_prices_sort_order_key UNIQUE (sort_order)
);

ALTER TABLE public.buying_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to buying prices"
ON public.buying_prices
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.buying_prices (quantity_range, price_inr, sort_order) VALUES
('0–50', 87.54, 1),
('50–100', 87.04, 2),
('100–200', 86.54, 3),
('200–500', 86.04, 4),
('500–1000', 85.54, 5),
('1000+', 85.04, 6);
