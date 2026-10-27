-- One-off catalog update (28 Oct 2026): function-led "+" names. URLs (slugs) stay the same.
-- Run once in Supabase → SQL Editor. New bundles are added separately via Admin → Products → "Import launch catalog".
update products set data = jsonb_set(data, '{name}', to_jsonb(v.name)), updated_at = now()
from (values
  ('magnesium-complex', 'Magnesium Sleep+'),
  ('ashwagandha', 'Ashwagandha Calm+'),
  ('probiotic-complex', 'Probiotic Gut+'),
  ('collagen-complex', 'Collagen Glow+'),
  ('glucosamine-complex', 'Glucosamine Joint+'),
  ('menopause-complex', 'Menopause Balance+'),
  ('mushroom-blend-powder', 'Mushroom Clarity+'),
  ('multivitamin', 'Daily Multi+')
) as v(slug, name)
where products.slug = v.slug;
