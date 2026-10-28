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

-- Product page headlines (tagline), shown after the name: "Magnesium Sleep+: Restful Sleep & Calm".
update products set data = data || jsonb_build_object('tagline', v.tagline), updated_at = now()
from (values
  ('probiotic-complex', 'Digestive Balance & Gut Comfort'),
  ('glucosamine-complex', 'Joint Comfort & Mobility'),
  ('collagen-complex', 'Skin, Hair & Nail Support'),
  ('menopause-complex', 'Support Through Menopause'),
  ('magnesium-complex', 'Restful Sleep & Calm'),
  ('zinc', 'Immune & Skin Support'),
  ('iron-complex', 'Gentle Iron for Everyday Energy'),
  ('vitamin-d3-k2', 'Bone, Immune & Energy Support'),
  ('turmeric-complex', 'Joint Comfort & Recovery'),
  ('berberine-complex', 'Metabolic Health Support'),
  ('ashwagandha', 'Stress Resilience & Calm'),
  ('multivitamin', 'Your Daily Foundation'),
  ('biotin-complex', 'Hair, Skin & Nail Support'),
  ('creatine', 'Strength, Power & Focus'),
  ('mushroom-blend-powder', 'Focus & Daily Energy'),
  ('nac', 'Antioxidant & Glutathione Support')
) as v(slug, tagline)
where products.slug = v.slug;
