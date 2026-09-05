/*
# Create Sree Durga Pickles & Snacks catalog

1. New Tables
- `store_profiles` stores signed-in store accounts and their role. The first account is made an admin automatically; later accounts are customers unless promoted in the database.
- `products` stores the public catalog: name, category, description, price, weight, image path, vegetarian label, and availability.

2. Security
- Row level security is enabled on both tables.
- Anyone can read available products, including visitors who are not signed in.
- Only authenticated admins can add, edit, or remove products.
- Store profiles are private to the signed-in account that owns them.

3. Important Notes
- Product prices and availability are stored centrally so the storefront and admin catalog stay in sync.
- The first signed-up store account becomes the initial admin for this single-shop catalog.
*/

CREATE TABLE IF NOT EXISTS public.store_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Veg Pickles', 'Non-Veg Pickles', 'Karam Podulu', 'Snacks')),
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  weight text NOT NULL DEFAULT '250 g',
  image_url text NOT NULL,
  is_vegetarian boolean NOT NULL DEFAULT true,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.store_profiles;
CREATE POLICY "profiles_select_own" ON public.store_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.store_profiles;
CREATE POLICY "profiles_insert_own" ON public.store_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.store_profiles;
CREATE POLICY "profiles_update_own" ON public.store_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_delete_own" ON public.store_profiles;
CREATE POLICY "profiles_delete_own" ON public.store_profiles FOR DELETE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (is_available = true OR EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "products_admin_insert" ON public.products;
CREATE POLICY "products_admin_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "products_admin_update" ON public.products;
CREATE POLICY "products_admin_update" ON public.products FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "products_admin_delete" ON public.products;
CREATE POLICY "products_admin_delete" ON public.products FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.store_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_store_account()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.store_profiles (id, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    CASE WHEN NOT EXISTS (SELECT 1 FROM public.store_profiles WHERE role = 'admin') THEN 'admin' ELSE 'customer' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_store_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_store_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_store_account();

REVOKE ALL ON FUNCTION public.handle_new_store_account() FROM PUBLIC;

INSERT INTO public.products (name, category, description, price, weight, image_url, is_vegetarian)
SELECT * FROM (VALUES
  ('Gongura Pickle', 'Veg Pickles', 'Tangy gongura leaves slow-cooked with our signature spice blend.', 180.00, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', true),
  ('Avakaya Mango Pickle', 'Veg Pickles', 'Bold raw mango pieces, red chilli and mustard in every jar.', 200.00, '250 g', '/images/image.png', true),
  ('Chicken Pickle', 'Non-Veg Pickles', 'Tender chicken pieces layered in aromatic Andhra masala.', 320.00, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Kandi Podi', 'Karam Podulu', 'Roasted toor dal and red chillies ground into a fragrant podi.', 140.00, '250 g', '/images/image copy.png', true),
  ('Idly Karam Podi', 'Karam Podulu', 'A homestyle blend made for hot idlis, dosas and rice.', 140.00, '250 g', '/images/image copy.png', true),
  ('Andhra Snack Box', 'Snacks', 'A crunchy selection of traditional savouries for tea time.', 220.00, '400 g', '/images/image copy 2.png', true)
) AS seed(name, category, description, price, weight, image_url, is_vegetarian)
WHERE NOT EXISTS (SELECT 1 FROM public.products);
