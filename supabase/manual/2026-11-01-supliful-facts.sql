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

-- 4. Ashwagandha colour: violet replaces the brown (label uses a violet → plum gradient).
update products set data = data || jsonb_build_object('color', '#745799'), updated_at = now()
where slug = 'ashwagandha';
