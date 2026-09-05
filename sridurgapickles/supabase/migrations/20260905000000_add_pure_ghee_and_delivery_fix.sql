-- Add Pure Ghee to the live catalog and ensure the optional delivery table exists.
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pincode_prefix text NOT NULL,
  charge numeric(10,2) NOT NULL CHECK (charge >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "delivery_public_read" ON public.delivery_zones;
CREATE POLICY "delivery_public_read" ON public.delivery_zones FOR SELECT TO anon, authenticated
USING (is_active = true OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "delivery_admin_insert" ON public.delivery_zones;
CREATE POLICY "delivery_admin_insert" ON public.delivery_zones FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "delivery_admin_update" ON public.delivery_zones;
CREATE POLICY "delivery_admin_update" ON public.delivery_zones FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "delivery_admin_delete" ON public.delivery_zones;
CREATE POLICY "delivery_admin_delete" ON public.delivery_zones FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO public.products (name, category, description, price, weight, image_url, is_vegetarian, is_available)
SELECT 'Pure Ghee', 'Snacks',
       'Pure, rich and aromatic ghee made from fresh dairy ingredients. Perfect for cooking, sweets, and adding a delicious traditional flavour to everyday meals.',
       1040, '250 g', '/images/snacks/pure-ghee.jpg', true, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(trim(name)) = 'pure ghee');

UPDATE public.products
SET category = 'Snacks',
    price = 1040,
    weight = '250 g',
    image_url = '/images/snacks/pure-ghee.jpg',
    description = 'Pure, rich and aromatic ghee made from fresh dairy ingredients. Perfect for cooking, sweets, and adding a delicious traditional flavour to everyday meals.',
    is_vegetarian = true,
    is_available = true
WHERE lower(trim(name)) = 'pure ghee';
