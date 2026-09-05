-- Repair admin authentication for accounts that existed before the store-profile trigger.
-- This preserves the first existing account as admin and leaves later accounts as customers.

DO $$
DECLARE
  user_row record;
  has_admin boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.store_profiles WHERE role = 'admin') INTO has_admin;

  FOR user_row IN
    SELECT u.id, COALESCE(u.email, '') AS email
    FROM auth.users u
    LEFT JOIN public.store_profiles p ON p.id = u.id
    WHERE p.id IS NULL
    ORDER BY u.created_at ASC
  LOOP
    INSERT INTO public.store_profiles (id, email, role)
    VALUES (user_row.id, user_row.email, CASE WHEN NOT has_admin THEN 'admin' ELSE 'customer' END);
    IF NOT has_admin THEN
      has_admin := true;
    END IF;
  END LOOP;
END $$;

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
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_store_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_store_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_store_account();

REVOKE ALL ON FUNCTION public.handle_new_store_account() FROM PUBLIC;
