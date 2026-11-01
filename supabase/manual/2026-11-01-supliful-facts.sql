-- Supliful facts panels received 1 Nov 2026: ashwagandha, magnesium, colostrum.
-- Run ONCE in Supabase -> SQL Editor. Safe to re-run. Afterwards save any product in Admin (refreshes the cache).
-- 1. Ashwagandha Calm+: Supliful's "Ashwagandha Plus" as sold, every ingredient listed.
update products set data = data
  || jsonb_build_object(
    'description', 'KSM-66® ashwagandha root extract at 600 mg, the dose used in the main human studies on stress and sleep, plus vitamins D3, B6 and B12, L-arginine, maca, Panax ginseng and shatavari.',
    'benefits', '["Supports a healthy stress response", "Supports energy and vitality", "With vitamins D3, B6 and B12", "KSM-66®, a studied root extract"]'::jsonb,
    'ingredients', '[
      {"name": "Vitamin D3 (as cholecalciferol)", "amount": "20mcg"},
      {"name": "Vitamin B6 (as pyridoxine hydrochloride)", "amount": "2.5mg"},
      {"name": "Vitamin B12 (as methylcobalamin 1%)", "amount": "25mcg"},
      {"name": "KSM-66® Ashwagandha Root Extract (5% withanolides)", "amount": "600mg"},
      {"name": "L-Arginine", "amount": "300mg"},
      {"name": "Maca Root Powder (Lepidium meyenii)", "amount": "150mg"},
      {"name": "Panax Ginseng Root Powder", "amount": "100mg"},
      {"name": "Shatavari Root Powder (Asparagus racemosus)", "amount": "50mg"}
    ]'::jsonb,
    'otherIngredients', 'HPMC (vegetable capsule).',
    'dosage', 'Take 2 capsules daily, ideally with a meal and 6–8 oz of water.',
    'dietaryTags', '["gluten-free", "sugar-free"]'::jsonb
  ), updated_at = now()
where slug = 'ashwagandha';

-- 2. Magnesium Sleep+: formula already matches; drop the unconfirmed "low-fodmap" tag.
update products set data = jsonb_set(data, '{dietaryTags}', (data->'dietaryTags') - 'low-fodmap'), updated_at = now()
where slug = 'magnesium-complex';

-- 3. Colostrum+ (hidden draft; only if already imported): Supliful's directions, adults only, IgG per scoop.
update products set data = data
  || jsonb_build_object(
    'description', 'Bovine colostrum, the nutrient-rich first milk, at 2,300 mg per scoop and standardized to 25% IgG (immunoglobulins). Each scoop gives 575 mg of IgG. Unflavored powder that mixes into cold water or your favorite drink.',
    'ingredients', '[{"name": "Bovine Colostrum (25% IgG)", "amount": "2300mg", "description": "Provides 575 mg immunoglobulin G (IgG)"}]'::jsonb,
    'dosage', 'Mix 1 scoop (2.3 g) into 6–8 oz (177–237 ml) of cold water or your favorite drink once a day. Drink within 10 minutes of mixing.',
    'ageRestricted', true,
    'dietaryTags', '["gluten-free"]'::jsonb
  ), updated_at = now()
where slug = 'colostrum';

-- 4. Ashwagandha colour: coral → berry gradient on the label replaces the brown; site colour below.
update products set data = data || jsonb_build_object('color', '#B6575E'), updated_at = now()
where slug = 'ashwagandha';

-- 5. Label colours (gradients on the label; these are the site colours): Lion's Mane teal, CoQ10 ruby.
update products set data = data || jsonb_build_object('color', '#27798A'), updated_at = now() where slug = 'lions-mane';
update products set data = data || jsonb_build_object('color', '#9B2B46'), updated_at = now() where slug = 'coq10';

-- 6. Lion's Mane directions; Turmeric Complex = Supliful's Platinum Turmeric as sold (contains shellfish), price $29.
update products set data = data || jsonb_build_object('dosage', 'Take 2 capsules daily, with or without food.'), updated_at = now()
where slug = 'lions-mane';
update products set data = data
  || jsonb_build_object(
    'shortBenefit', 'Supports joint comfort and a healthy inflammatory response.',
    'description', 'Turmeric root with a 95% curcuminoid extract, plus glucosamine, chondroitin, boswellia, ginger and BioPerine® black pepper extract for absorption.',
    'whoFor', 'Active people and anyone who wants daily joint support. Not for anyone with a shellfish allergy.',
    'benefits', '["Supports joint comfort", "Supports a healthy inflammatory response", "With glucosamine and chondroitin", "BioPerine® for absorption"]'::jsonb,
    'ingredients', '[
      {"name": "Turmeric Root Powder (Curcuma longa)", "amount": "800mg"},
      {"name": "Glucosamine Sulfate 2KCl", "amount": "200mg"},
      {"name": "Turmeric 95% Curcuminoids (Curcuma longa root)", "amount": "100mg"},
      {"name": "Ginger Root Extract (Zingiber officinale)", "amount": "100mg"},
      {"name": "Chondroitin Sulfate", "amount": "50mg"},
      {"name": "Boswellia Extract (Boswellia carteri resin)", "amount": "40mg"},
      {"name": "MSM (methylsulfonylmethane)", "amount": "10mg"},
      {"name": "BioPerine® (black pepper extract)", "amount": "10mg"},
      {"name": "Quercetin Dihydrate (Sophora japonica flower)", "amount": "8mg"},
      {"name": "L-Methionine", "amount": "8mg"},
      {"name": "Bromelain (Ananas comosus stem)", "amount": "8mg"}
    ]'::jsonb,
    'otherIngredients', 'Hypromellose (vegetable capsule), rice flour. Contains: shellfish (crab, lobster, crawfish).',
    'dosage', 'Take 2 capsules once a day, 20–30 minutes before a meal.',
    'dietaryTags', '["gluten-free"]'::jsonb,
    'basePrice', 29
  ), updated_at = now()
where slug = 'turmeric-complex';
