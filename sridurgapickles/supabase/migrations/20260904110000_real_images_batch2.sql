/*
# Replace placeholder images — batch 2 (Veg Pickles, Non-Veg Pickles, Karam Podulu, Snacks)

1. Modified Data
   - Updates image_url for 20 products with the shop's own photos
     (stored under /public/images/<category>/), replacing the temporary
     Pexels stock placeholders.

2. Important Notes
   - Only image_url is changed — no prices, names, or other fields.
   - Safe to re-run: updates are idempotent (matched by exact product name).
*/

WITH image_updates(name, url) AS (VALUES
  -- Veg Pickles
  ('Grated Amla Pickle',          '/images/pickles/grated-amla-pickle.jpg'),
  ('Red Chilli Pickle',           '/images/pickles/red-chilli-pickle.jpg'),
  ('Mango Biryani Pickle',        '/images/pickles/mango-biryani-pickle.jpg'),
  ('Drumsticks Pickle',           '/images/pickles/drumsticks-pickle.jpg'),
  ('Beetroot Pickle',             '/images/pickles/beetroot-pickle.jpg'),
  ('Lemon Pickle',                '/images/pickles/lemon-pickle.jpg'),
  -- Non-Veg Pickles
  ('Small Prawns Pickle',         '/images/nonveg-pickles/small-prawns-pickle.jpg'),
  ('Mutton Pickle',               '/images/nonveg-pickles/mutton-pickle.jpg'),
  ('Sea Bass Fish Pickle',        '/images/nonveg-pickles/sea-bass-fish-pickle.jpg'),
  ('Boneless Mutton Pickle',      '/images/nonveg-pickles/boneless-mutton-pickle.jpg'),
  ('Chicken Joint Biryani Pickle','/images/nonveg-pickles/chicken-joint-biryani-pickle.jpg'),
  ('Crab Pickle',                 '/images/nonveg-pickles/crab-pickle.jpg'),
  ('Large Prawns Pickle',         '/images/nonveg-pickles/large-prawns-pickle.jpg'),
  ('Murrel Fish Pickle',          '/images/nonveg-pickles/murrel-fish-pickle.jpg'),
  -- Karam Podulu
  ('Sambar Podi',                 '/images/karam-podulu/sambar-podi.jpg'),
  -- Snacks
  ('Dootha Pakodi',               '/images/snacks/dootha-pakodi.jpg'),
  ('Jantikalu',                   '/images/snacks/jantikalu.jpg'),
  ('Ragi Laddu',                  '/images/snacks/ragi-laddu.jpg'),
  ('Nuvvula Ariselu',             '/images/snacks/nuvvula-ariselu.jpg'),
  ('Challa Jantikalu',            '/images/snacks/challa-jantikalu.jpg')
)
UPDATE public.products p
SET image_url = iu.url
FROM image_updates iu
WHERE lower(p.name) = lower(iu.name);
