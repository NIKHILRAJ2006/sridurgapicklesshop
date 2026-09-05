/*
# Replace placeholder Veg Pickle images with real product photos

1. Modified Data
   - Updates image_url for the 12 Veg Pickle products with the shop's own
     photos (stored in /public/images/pickles/), replacing the temporary
     Pexels stock placeholders.

2. Important Notes
   - Only image_url is changed — no prices, names, or other fields.
   - Safe to re-run: updates are idempotent (matched by exact product name).
*/

WITH image_updates(name, url) AS (VALUES
  ('Gongura Pickle',          '/images/pickles/gongura-pickle.jpg'),
  ('Avakaya Mango Pickle',    '/images/pickles/avakaya-mango-pickle.jpg'),
  ('Tomato Pickle',           '/images/pickles/tomato-pickle.jpg'),
  ('Amla Pickle',             '/images/pickles/amla-pickle.jpg'),
  ('Raw Tamarind Pickle',     '/images/pickles/raw-tamarind-pickle.jpg'),
  ('Carrot Pickle',           '/images/pickles/carrot-pickle.jpg'),
  ('Green Chilli Pickle',     '/images/pickles/green-chilli-pickle.jpg'),
  ('Garlic Pickle',           '/images/pickles/garlic-pickle.jpg'),
  ('Small Cut Mango Pickle',  '/images/pickles/small-cut-mango-pickle.jpg'),
  ('Ginger Pickle',           '/images/pickles/ginger-pickle.jpg'),
  ('Bitter Gourd Pickle',     '/images/pickles/bitter-gourd-pickle.jpg'),
  ('Mixed Veg Pickle',        '/images/pickles/mixed-veg-pickle.jpg')
)
UPDATE public.products p
SET image_url = iu.url
FROM image_updates iu
WHERE lower(p.name) = lower(iu.name);
