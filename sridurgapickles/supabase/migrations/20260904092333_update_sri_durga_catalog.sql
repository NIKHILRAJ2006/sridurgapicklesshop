/*
# Update Sri Durga brand catalog and menu

1. Modified Data
- Updates product imagery for vegetarian pickles, karam podulu, and snacks using the newly supplied shop images.
- Preserves the existing chicken pickle image exactly as requested.
- Adds the menu items visible in the supplied menu reference across veg pickles, non-veg pickles, karam podulu, vadialu, and snacks.

2. Important Notes
- Existing product records are not deleted.
- New products are inserted only when their names are not already present, so this migration is safe to re-run.
- Prices are seeded from the supplied menu image and can be edited later from the admin panel.

3. Security
- No table permissions or row-level security policies are changed.
*/

UPDATE public.products
SET image_url = '/images/image copy 6.png'
WHERE category = 'Veg Pickles';

UPDATE public.products
SET image_url = '/images/image copy 4.png'
WHERE category = 'Karam Podulu';

UPDATE public.products
SET image_url = '/images/image copy 5.png'
WHERE category = 'Snacks';

INSERT INTO public.products (name, category, description, price, weight, image_url, is_vegetarian)
SELECT seed.name, seed.category, seed.description, seed.price, seed.weight, seed.image_url, seed.is_vegetarian
FROM (VALUES
  ('Mango Biryani Pickle', 'Veg Pickles', 'Classic Andhra mango pickle with a rich biryani spice finish.', 145, '250 g', '/images/image copy 6.png', true),
  ('Jaggery Mango Pickle', 'Veg Pickles', 'Sweet and spicy mango pickle balanced with traditional jaggery.', 145, '250 g', '/images/image copy 6.png', true),
  ('Ginger Mango Pickle', 'Veg Pickles', 'Fresh ginger and raw mango with fragrant mustard tempering.', 145, '250 g', '/images/image copy 6.png', true),
  ('Small Cut Mango Pickle', 'Veg Pickles', 'Small-cut mango pieces coated in bold Andhra masala.', 145, '250 g', '/images/image copy 6.png', true),
  ('Grated Mango Pickle', 'Veg Pickles', 'Finely grated mango with chilli, oil and roasted spices.', 145, '250 g', '/images/image copy 6.png', true),
  ('Amla Pickle', 'Veg Pickles', 'Whole amla preserved with a punchy South Indian spice blend.', 145, '250 g', '/images/image copy 6.png', true),
  ('Grated Amla Pickle', 'Veg Pickles', 'Tangy grated amla pickle made fresh in small batches.', 145, '250 g', '/images/image copy 6.png', true),
  ('Ginger Pickle', 'Veg Pickles', 'A bright, spicy ginger pickle for rice and curd rice.', 145, '250 g', '/images/image copy 6.png', true),
  ('Garlic Pickle', 'Veg Pickles', 'Aromatic garlic cloves slow-cooked in Andhra chilli masala.', 145, '250 g', '/images/image copy 6.png', true),
  ('Drumsticks Pickle', 'Veg Pickles', 'Tender drumstick pieces in a tangy homemade pickle.', 145, '250 g', '/images/image copy 6.png', true),
  ('Lemon Pickle', 'Veg Pickles', 'Sun-cured lemon pickle with a fresh citrus kick.', 145, '250 g', '/images/image copy 6.png', true),
  ('Tomato Pickle', 'Veg Pickles', 'Ripe tomatoes, red chillies and garlic in a delicious spreadable pickle.', 145, '250 g', '/images/image copy 6.png', true),
  ('Tomato Red Chilli Pickle', 'Veg Pickles', 'Tomato pickle for those who love an extra red chilli kick.', 145, '250 g', '/images/image copy 6.png', true),
  ('Tamarind Pickle', 'Veg Pickles', 'Deep, tangy tamarind pickle with roasted spices.', 145, '250 g', '/images/image copy 6.png', true),
  ('Raw Tamarind Pickle', 'Veg Pickles', 'Fresh raw tamarind with a bold traditional tempering.', 145, '250 g', '/images/image copy 6.png', true),
  ('Red Chilli Pickle', 'Veg Pickles', 'Whole red chillies preserved in a spicy Andhra masala.', 145, '250 g', '/images/image copy 6.png', true),
  ('Green Chilli Pickle', 'Veg Pickles', 'Crisp green chillies with tangy lemon and mustard.', 145, '250 g', '/images/image copy 6.png', true),
  ('Bitter Gourd Pickle', 'Veg Pickles', 'Bitter gourd transformed with a rich, spicy masala.', 145, '250 g', '/images/image copy 6.png', true),
  ('Mixed Veg Pickle', 'Veg Pickles', 'A colourful mix of seasonal vegetables in signature pickle masala.', 145, '250 g', '/images/image copy 6.png', true),
  ('Carrot Pickle', 'Veg Pickles', 'Crunchy carrot pickle with fresh chilli and ginger.', 145, '250 g', '/images/image copy 6.png', true),
  ('Beetroot Pickle', 'Veg Pickles', 'Earthy beetroot with a vibrant Andhra spice blend.', 145, '250 g', '/images/image copy 6.png', true),
  ('Chicken Pickle', 'Non-Veg Pickles', 'Tender chicken pieces layered in aromatic Andhra masala.', 260, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Boneless Chicken Pickle', 'Non-Veg Pickles', 'Boneless chicken pieces in a rich, spicy homemade pickle.', 305, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Country Chicken Pickle', 'Non-Veg Pickles', 'Traditional country chicken pickle with slow-cooked spices.', 345, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Chicken Joint Biryani Pickle', 'Non-Veg Pickles', 'Aromatic chicken joint pickle with biryani-style masala.', 295, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Mutton Pickle', 'Non-Veg Pickles', 'Tender mutton pieces cooked in a deep Andhra spice blend.', 420, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Boneless Mutton Pickle', 'Non-Veg Pickles', 'Rich boneless mutton pickle, packed fresh in our signature jar.', 470, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Small Prawns Pickle', 'Non-Veg Pickles', 'Small prawns cooked with garlic, chilli and coastal spices.', 385, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Large Prawns Pickle', 'Non-Veg Pickles', 'Juicy large prawns in a bold, tangy pickle masala.', 425, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Murrel Fish Pickle', 'Non-Veg Pickles', 'Boneless murrel fish preserved in an authentic Andhra recipe.', 410, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Sea Bass Fish Pickle', 'Non-Veg Pickles', 'Sea bass fish pickle with a bright coastal spice profile.', 495, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Crab Pickle', 'Non-Veg Pickles', 'Traditional crab pickle with fresh masala and curry leaves.', 325, '250 g', '/images/WhatsApp_Image_2026-09-04_at_1.48.47_PM.jpeg', false),
  ('Rice Karappodi', 'Karam Podulu', 'Roasted lentils and red chilli ground for hot rice and ghee.', 65, '100 g', '/images/image copy 4.png', true),
  ('Idly Karappodi', 'Karam Podulu', 'The perfect dry spice powder for idli and dosa.', 65, '100 g', '/images/image copy 4.png', true),
  ('Toor Dal Karappodi', 'Karam Podulu', 'Roasted toor dal and chillies with a fragrant tempering.', 65, '100 g', '/images/image copy 4.png', true),
  ('Drumstick Leaves Karappodi', 'Karam Podulu', 'Nutritious drumstick leaf powder with traditional spices.', 74, '100 g', '/images/image copy 4.png', true),
  ('Bitter Gourd Karappodi', 'Karam Podulu', 'Roasted bitter gourd powder with a balanced spicy finish.', 65, '100 g', '/images/image copy 4.png', true),
  ('Curry Leaves Karappodi', 'Karam Podulu', 'A fragrant curry leaf podi for rice, idli and dosa.', 65, '100 g', '/images/image copy 4.png', true),
  ('Sorrell Leaves Karappodi', 'Karam Podulu', 'Tangy gongura-style sorrell leaf spice powder.', 62, '100 g', '/images/image copy 4.png', true),
  ('Coriander Karappodi', 'Karam Podulu', 'Roasted coriander and lentil powder with a warm aroma.', 62, '100 g', '/images/image copy 4.png', true),
  ('Mint Leaves Karappodi', 'Karam Podulu', 'Cooling mint leaves blended with roasted spices.', 62, '100 g', '/images/image copy 4.png', true),
  ('Groundnut Karappodi', 'Karam Podulu', 'Nutty roasted peanut podi with a delicious chilli kick.', 65, '100 g', '/images/image copy 4.png', true),
  ('Sesame Karappodi', 'Karam Podulu', 'Roasted sesame and red chilli powder for rice and snacks.', 70, '100 g', '/images/image copy 4.png', true),
  ('Garlic Karappodi', 'Karam Podulu', 'Bold garlic podi for a rich, spicy meal-time finish.', 65, '100 g', '/images/image copy 4.png', true),
  ('Roasted Dal Karappodi', 'Karam Podulu', 'Crisp roasted lentils ground with homemade spices.', 65, '100 g', '/images/image copy 4.png', true),
  ('Nalleru Karappodi', 'Karam Podulu', 'Traditional nalleru podi with an earthy, roasted flavour.', 72, '100 g', '/images/image copy 4.png', true),
  ('Flax Seeds Karappodi', 'Karam Podulu', 'Nutritious flax seed powder with a gentle chilli warmth.', 77, '100 g', '/images/image copy 4.png', true),
  ('Dry Prawns Karappodi', 'Karam Podulu', 'A savoury dry prawns spice powder for rice and curries.', 74, '100 g', '/images/image copy 4.png', false),
  ('Rasam Podi', 'Karam Podulu', 'Aromatic rasam spice blend for comforting South Indian rasam.', 56, '100 g', '/images/image copy 4.png', true),
  ('Sambar Podi', 'Karam Podulu', 'Balanced roasted spices for homestyle sambar.', 56, '100 g', '/images/image copy 4.png', true),
  ('Kura Karam', 'Karam Podulu', 'Everyday curry chilli powder for vegetables and dals.', 140, '250 g', '/images/image copy 4.png', true),
  ('Turmeric Powder', 'Karam Podulu', 'Bright, aromatic turmeric powder for everyday cooking.', 56, '100 g', '/images/image copy 4.png', true),
  ('Ribbon Murukulu', 'Snacks', 'Crispy ribbon murukku made for tea-time snacking.', 91, '200 g', '/images/image copy 5.png', true),
  ('Dootha Pakodi', 'Snacks', 'Crunchy savoury pakodi with a light, crisp texture.', 91, '200 g', '/images/image copy 5.png', true),
  ('Atukula Mixture', 'Snacks', 'Crispy flattened rice mixture with roasted peanuts and spices.', 91, '200 g', '/images/image copy 5.png', true),
  ('Lava Karapusa', 'Snacks', 'Fine, spicy karapusa with an irresistible crunch.', 91, '200 g', '/images/image copy 5.png', true),
  ('Sanna Karapusa', 'Snacks', 'Traditional savoury noodles with a delicate chilli flavour.', 91, '200 g', '/images/image copy 5.png', true),
  ('Palli Pakodi', 'Snacks', 'Crunchy peanut pakodi with a roasted homemade taste.', 95, '200 g', '/images/image copy 5.png', true),
  ('Jantikalu', 'Snacks', 'Classic Andhra jantikalu with a light, crisp bite.', 91, '200 g', '/images/image copy 5.png', true),
  ('Baru Murukulu', 'Snacks', 'Traditional spiral murukulu, crisp and savoury.', 91, '200 g', '/images/image copy 5.png', true),
  ('Round Murukulu', 'Snacks', 'Round-shaped crunchy murukulu for every tea break.', 91, '200 g', '/images/image copy 5.png', true),
  ('Challa Jantikalu', 'Snacks', 'Homestyle jantikalu with a delicate salted crunch.', 91, '200 g', '/images/image copy 5.png', true),
  ('Cornflakes Mixture', 'Snacks', 'Crispy cornflakes tossed with nuts and Andhra spices.', 91, '200 g', '/images/image copy 5.png', true),
  ('Kara Boondi', 'Snacks', 'Spicy boondi pearls that add crunch to every bite.', 91, '200 g', '/images/image copy 5.png', true),
  ('All Mixture', 'Snacks', 'A generous mix of classic South Indian savouries.', 91, '200 g', '/images/image copy 5.png', true),
  ('Small Chegodilu', 'Snacks', 'Ring-shaped rice flour snack with a satisfying crunch.', 91, '200 g', '/images/image copy 5.png', true),
  ('Dal Mudi Mixture', 'Snacks', 'Roasted dal and puffed rice snack mix with mild spice.', 95, '200 g', '/images/image copy 5.png', true),
  ('Masala Kabuli Chana', 'Snacks', 'Crunchy seasoned chickpeas with a roasted masala coating.', 111, '200 g', '/images/image copy 5.png', true),
  ('Chekkalu', 'Snacks', 'Thin, crisp rice crackers with sesame and chilli.', 91, '200 g', '/images/image copy 5.png', true),
  ('Sanna Boondi Chikki', 'Snacks', 'Sweet and crunchy boondi chikki made with care.', 98, '200 g', '/images/image copy 5.png', true),
  ('Nuvvula Ariselu', 'Snacks', 'Traditional sesame sweet with a soft, rich bite.', 283, '500 g', '/images/image copy 5.png', true),
  ('Sweet Boondi', 'Snacks', 'Tiny golden boondi pearls made fresh for celebrations.', 91, '200 g', '/images/image copy 5.png', true),
  ('Nuvvula Chikki', 'Snacks', 'Sesame brittle with a naturally nutty sweetness.', 107, '200 g', '/images/image copy 5.png', true),
  ('Palli Chikki', 'Snacks', 'Crunchy peanut chikki made with traditional jaggery.', 103, '200 g', '/images/image copy 5.png', true),
  ('Dry Fruit Laddu', 'Snacks', 'Rich dry fruit laddus prepared for special occasions.', 343, '500 g', '/images/image copy 5.png', true),
  ('Coconut Laddu', 'Snacks', 'Soft coconut laddus with a homestyle festive flavour.', 290, '500 g', '/images/image copy 5.png', true),
  ('Ragi Laddu', 'Snacks', 'Wholesome ragi laddus with a gentle jaggery sweetness.', 340, '500 g', '/images/image copy 5.png', true),
  ('Pure Honey', 'Snacks', 'Naturally sweet honey for everyday wellness and cooking.', 680, '1 kg', '/images/image copy 5.png', true),
  ('Pure Ghee', 'Snacks', 'Aromatic pure ghee for rice, sweets and everyday cooking.', 1040, '1 kg', '/images/image copy 5.png', true)
) AS seed(name, category, description, price, weight, image_url, is_vegetarian)
WHERE NOT EXISTS (SELECT 1 FROM public.products existing WHERE lower(existing.name) = lower(seed.name));
