-- Creatine: match Supliful's actual product (31 Oct 2026). Run ONCE in Supabase -> SQL Editor. Safe to re-run.
-- 1 scoop (5.6 g) = 5,000 mg creatine monohydrate, 50 servings, net wt 281 g (9.9 oz), Supliful's directions.
-- Afterwards save any product in Admin (refreshes the cache).
update products set data = data
  || jsonb_build_object(
    'servings', 50,
    'netWeight', '281 g (9.9 oz)',
    'dosage', 'Mix 1 scoop (5.6 g) with 8 oz (237 ml) of water or juice. Take 4 times daily for the first 5 days (loading phase), then 1–2 times daily, or as directed by a healthcare professional.',
    'dietaryTags', '["vegan", "gluten-free", "sugar-free"]'::jsonb
  ), updated_at = now()
where slug = 'creatine';
