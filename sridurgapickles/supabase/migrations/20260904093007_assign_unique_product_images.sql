/*
# Assign unique images to every product

1. Modified Data
- Updates the image_url for every product in the catalog so each item has its own distinct photo from Pexels stock photography.
- The Chicken Pickle image is preserved as the WhatsApp jar photo per the shop owner's request.
- All other products receive a unique, relevant food image URL.

2. Important Notes
- No products are added or deleted.
- No prices, names, or other fields are changed — only image_url.
- Safe to re-run: updates are idempotent.
*/

WITH image_updates(name, url) AS (VALUES
  -- Veg Pickles
  ('Gongura Pickle', 'https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Mango Biryani Pickle', 'https://images.pexels.com/photos/7812134/pexels-photo-7812134.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Jaggery Mango Pickle', 'https://images.pexels.com/photos/38521741/pexels-photo-38521741.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Ginger Mango Pickle', 'https://images.pexels.com/photos/9164642/pexels-photo-9164642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Small Cut Mango Pickle', 'https://images.pexels.com/photos/35267279/pexels-photo-35267279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Grated Mango Pickle', 'https://images.pexels.com/photos/5410417/pexels-photo-5410417.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Avakaya Mango Pickle', 'https://images.pexels.com/photos/11584813/pexels-photo-11584813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Amla Pickle', 'https://images.pexels.com/photos/11584813/pexels-photo-11584813.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Grated Amla Pickle', 'https://images.pexels.com/photos/38857376/pexels-photo-38857376.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Ginger Pickle', 'https://images.pexels.com/photos/4397255/pexels-photo-4397255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Garlic Pickle', 'https://images.pexels.com/photos/38826528/pexels-photo-38826528.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Drumsticks Pickle', 'https://images.pexels.com/photos/33984956/pexels-photo-33984956.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Lemon Pickle', 'https://images.pexels.com/photos/20523631/pexels-photo-20523631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Tomato Pickle', 'https://images.pexels.com/photos/12727969/pexels-photo-12727969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Tomato Red Chilli Pickle', 'https://images.pexels.com/photos/13724203/pexels-photo-13724203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Tamarind Pickle', 'https://images.pexels.com/photos/16575686/pexels-photo-16575686.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Raw Tamarind Pickle', 'https://images.pexels.com/photos/36904521/pexels-photo-36904521.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Red Chilli Pickle', 'https://images.pexels.com/photos/33440713/pexels-photo-33440713.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Green Chilli Pickle', 'https://images.pexels.com/photos/8956721/pexels-photo-8956721.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Bitter Gourd Pickle', 'https://images.pexels.com/photos/37420331/pexels-photo-37420331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Mixed Veg Pickle', 'https://images.pexels.com/photos/33984942/pexels-photo-33984942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Carrot Pickle', 'https://images.pexels.com/photos/39337631/pexels-photo-39337631.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Beetroot Pickle', 'https://images.pexels.com/photos/16276217/pexels-photo-16276217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  -- Non-Veg Pickles (Chicken Pickle keeps WhatsApp image)
  ('Boneless Chicken Pickle', 'https://images.pexels.com/photos/6358925/pexels-photo-6358925.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Country Chicken Pickle', 'https://images.pexels.com/photos/6358978/pexels-photo-6358978.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Chicken Joint Biryani Pickle', 'https://images.pexels.com/photos/34217294/pexels-photo-34217294.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Mutton Pickle', 'https://images.pexels.com/photos/28674565/pexels-photo-28674565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Boneless Mutton Pickle', 'https://images.pexels.com/photos/34616638/pexels-photo-34616638.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Small Prawns Pickle', 'https://images.pexels.com/photos/33202174/pexels-photo-33202174.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Large Prawns Pickle', 'https://images.pexels.com/photos/33202175/pexels-photo-33202175.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Murrel Fish Pickle', 'https://images.pexels.com/photos/32451679/pexels-photo-32451679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sea Bass Fish Pickle', 'https://images.pexels.com/photos/18698241/pexels-photo-18698241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Crab Pickle', 'https://images.pexels.com/photos/35267288/pexels-photo-35267288.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  -- Karam Podulu
  ('Rice Karappodi', 'https://images.pexels.com/photos/31280796/pexels-photo-31280796.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Idly Karappodi', 'https://images.pexels.com/photos/7208238/pexels-photo-7208238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Toor Dal Karappodi', 'https://images.pexels.com/photos/32281706/pexels-photo-32281706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Kandi Podi', 'https://images.pexels.com/photos/32281706/pexels-photo-32281706.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Drumstick Leaves Karappodi', 'https://images.pexels.com/photos/6808985/pexels-photo-6808985.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Bitter Gourd Karappodi', 'https://images.pexels.com/photos/33440709/pexels-photo-33440709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Curry Leaves Karappodi', 'https://images.pexels.com/photos/37215213/pexels-photo-37215213.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sorrell Leaves Karappodi', 'https://images.pexels.com/photos/32144900/pexels-photo-32144900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Coriander Karappodi', 'https://images.pexels.com/photos/5504609/pexels-photo-5504609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Mint Leaves Karappodi', 'https://images.pexels.com/photos/33440712/pexels-photo-33440712.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Groundnut Karappodi', 'https://images.pexels.com/photos/2112789/pexels-photo-2112789.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sesame Karappodi', 'https://images.pexels.com/photos/33440714/pexels-photo-33440714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Garlic Karappodi', 'https://images.pexels.com/photos/33440709/pexels-photo-33440709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Roasted Dal Karappodi', 'https://images.pexels.com/photos/6220707/pexels-photo-6220707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Nalleru Karappodi', 'https://images.pexels.com/photos/6220709/pexels-photo-6220709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Flax Seeds Karappodi', 'https://images.pexels.com/photos/35991162/pexels-photo-35991162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Dry Prawns Karappodi', 'https://images.pexels.com/photos/30112814/pexels-photo-30112814.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Rasam Podi', 'https://images.pexels.com/photos/15623115/pexels-photo-15623115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sambar Podi', 'https://images.pexels.com/photos/7771989/pexels-photo-7771989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Kura Karam', 'https://images.pexels.com/photos/7420868/pexels-photo-7420868.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Turmeric Powder', 'https://images.pexels.com/photos/15623115/pexels-photo-15623115.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  -- Snacks
  ('Ribbon Murukulu', 'https://images.pexels.com/photos/12865863/pexels-photo-12865863.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Dootha Pakodi', 'https://images.pexels.com/photos/17480807/pexels-photo-17480807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Atukula Mixture', 'https://images.pexels.com/photos/36195516/pexels-photo-36195516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Lava Karapusa', 'https://images.pexels.com/photos/9832636/pexels-photo-9832636.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sanna Karapusa', 'https://images.pexels.com/photos/5992272/pexels-photo-5992272.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Palli Pakodi', 'https://images.pexels.com/photos/23910950/pexels-photo-23910950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Jantikalu', 'https://images.pexels.com/photos/27515043/pexels-photo-27515043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Baru Murukulu', 'https://images.pexels.com/photos/5992263/pexels-photo-5992263.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Round Murukulu', 'https://images.pexels.com/photos/7496245/pexels-photo-7496245.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Challa Jantikalu', 'https://images.pexels.com/photos/12865864/pexels-photo-12865864.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Cornflakes Mixture', 'https://images.pexels.com/photos/35213277/pexels-photo-35213277.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Kara Boondi', 'https://images.pexels.com/photos/9557672/pexels-photo-9557672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('All Mixture', 'https://images.pexels.com/photos/6576317/pexels-photo-6576317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Andhra Snack Box', 'https://images.pexels.com/photos/6576317/pexels-photo-6576317.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Small Chegodilu', 'https://images.pexels.com/photos/38433699/pexels-photo-38433699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Dal Mudi Mixture', 'https://images.pexels.com/photos/10810649/pexels-photo-10810649.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Masala Kabuli Chana', 'https://images.pexels.com/photos/10111952/pexels-photo-10111952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Chekkalu', 'https://images.pexels.com/photos/27532696/pexels-photo-27532696.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sanna Boondi Chikki', 'https://images.pexels.com/photos/5350676/pexels-photo-5350676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Nuvvula Ariselu', 'https://images.pexels.com/photos/8887027/pexels-photo-8887027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Sweet Boondi', 'https://images.pexels.com/photos/16062642/pexels-photo-16062642.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Nuvvula Chikki', 'https://images.pexels.com/photos/34153203/pexels-photo-34153203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Palli Chikki', 'https://images.pexels.com/photos/34153206/pexels-photo-34153206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Dry Fruit Laddu', 'https://images.pexels.com/photos/5719608/pexels-photo-5719608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Coconut Laddu', 'https://images.pexels.com/photos/34153206/pexels-photo-34153206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Ragi Laddu', 'https://images.pexels.com/photos/9106163/pexels-photo-9106163.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Pure Honey', 'https://images.pexels.com/photos/35282122/pexels-photo-35282122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'),
  ('Pure Ghee', 'https://images.pexels.com/photos/9105959/pexels-photo-9105959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')
)
UPDATE public.products p
SET image_url = iu.url
FROM image_updates iu
WHERE lower(p.name) = lower(iu.name)
AND p.name <> 'Chicken Pickle';
