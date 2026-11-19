-- 19 Nov 2026: remove "organic" from Lion's Mane (Supliful: the brand must hold the organic certificate).
-- Run in the Supabase SQL editor, then save any product in Admin (cache) and run Stripe sync.
update products set data = data || '{
  "description": "1,000 mg of lion''s mane mushroom a day, the classic mushroom for the mind.",
  "benefits": ["Supports focus and memory", "Supports healthy nerve function", "Fruiting body & mycelium", "Vegan pullulan capsule"],
  "ingredients": [{"name": "Lion''s Mane (fruiting body & mycelium, 40% polysaccharides)", "amount": "1,000mg"}],
  "otherIngredients": "Capsule (pullulan, water), pea starch."
}'::jsonb, updated_at = now() where slug = 'lions-mane';

-- The Journal post that mentions it (published posts live in the posts table).
update posts set body = replace(body, '1,000 mg of organic lion''s mane per serving', '1,000 mg of lion''s mane per serving'), updated_at = now()
where body like '%organic lion''s mane per serving%';

-- Check: should return 0 rows.
select slug from products where data::text ilike '%organic%' and slug = 'lions-mane';
