/*
  Dynamic store management:
  - Product reviews for every item.
  - Delivery zones by pincode prefix.
  - Store settings, including the France website URL.
  - Public product-image storage for admin uploads.
*/

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review text NOT NULL CHECK (char_length(trim(review)) BETWEEN 3 AND 1000),
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pincode_prefix text NOT NULL,
  charge numeric(10,2) NOT NULL CHECK (charge >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  france_website_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_read" ON public.product_reviews;
CREATE POLICY "reviews_public_read" ON public.product_reviews FOR SELECT TO anon, authenticated USING (is_approved = true);
DROP POLICY IF EXISTS "reviews_user_insert" ON public.product_reviews;
CREATE POLICY "reviews_user_insert" ON public.product_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "reviews_user_update" ON public.product_reviews;
CREATE POLICY "reviews_user_update" ON public.product_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "reviews_user_delete" ON public.product_reviews;
CREATE POLICY "reviews_user_delete" ON public.product_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "delivery_public_read" ON public.delivery_zones;
CREATE POLICY "delivery_public_read" ON public.delivery_zones FOR SELECT TO anon, authenticated USING (is_active = true OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "delivery_admin_insert" ON public.delivery_zones;
CREATE POLICY "delivery_admin_insert" ON public.delivery_zones FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "delivery_admin_update" ON public.delivery_zones;
CREATE POLICY "delivery_admin_update" ON public.delivery_zones FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "delivery_admin_delete" ON public.delivery_zones;
CREATE POLICY "delivery_admin_delete" ON public.delivery_zones FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "settings_public_read" ON public.store_settings;
CREATE POLICY "settings_public_read" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_admin_update" ON public.store_settings;
CREATE POLICY "settings_admin_update" ON public.store_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
