-- Catalog update (28 Oct 2026). Run ONCE in Supabase → SQL Editor. Safe to re-run.
-- Replaces 2026-10-28-plus-names.sql (included below as part 1).
-- Afterwards: Admin → Products → "Import launch catalog" (adds the bundles, NAC and CoQ10 drafts), then save any product or redeploy to refresh the cache.

-- Part 1: "+" names and product headlines
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

-- Part 2: formulas confirmed from Supliful's product pages (merges only these fields; supplier SKUs and other admin edits are kept)
update products set data = data || '{"description":"Magnesium glycinate, the gentle, well-absorbed form, at 275 mg of elemental magnesium per serving.","benefits":["Supports restful sleep","Supports muscle and nerve function","Reduces tiredness and fatigue","Gentle on the stomach"],"ingredients":[{"name":"Magnesium (as Magnesium Glycinate)","amount":"275mg","description":"From 2,500 mg magnesium glycinate"}],"otherIngredients":"Vegetable capsule (hypromellose), magnesium stearate, silicon dioxide, rice flour.","dosage":"Take 3 capsules daily, ideally after an evening meal.","servings":30,"extraFaqs":[{"q":"Why glycinate?","a":"Magnesium glycinate is well absorbed and gentler on the stomach than forms like oxide or citrate, which can have a laxative effect."}]}'::jsonb, updated_at = now() where slug = 'magnesium-complex';
update products set data = data || '{"description":"KSM-66® ashwagandha root extract at 600 mg, the dose used in the main human studies on stress and sleep.","benefits":["Supports a healthy stress response","Supports restful sleep","Supports energy and focus","KSM-66®, a studied root extract"],"ingredients":[{"name":"Ashwagandha Root Extract (KSM-66®, 5% withanolides)","amount":"600mg"}],"otherIngredients":"Vegetable capsule (HPMC).","dosage":"Take 2 capsules daily, together or split morning and evening.","servings":30}'::jsonb, updated_at = now() where slug = 'ashwagandha';
update products set data = data || '{"description":"Pure creatine monohydrate, the most-studied sports supplement there is. Unflavoured, one ingredient.","benefits":["Increases physical performance","Supports strength and power","Unflavoured, mixes into anything","Single ingredient"],"ingredients":[{"name":"Creatine Monohydrate","amount":"5g"}],"otherIngredients":"None.","dosage":"Mix 1 scoop (5g) into water or a shake daily.","servings":56,"extraFaqs":[{"q":"How many servings are in a jar?","a":"About 56 servings of 5g (281g jar)."}]}'::jsonb, updated_at = now() where slug = 'creatine';
update products set data = data || '{"description":"1,000 mg of organic lion''s mane mushroom a day, the classic mushroom for the mind.","benefits":["Supports focus and memory","Supports healthy nerve function","Organic, fruiting body & mycelium","Vegan pullulan capsule"],"ingredients":[{"name":"Organic Lion''s Mane (fruiting body & mycelium, 40% polysaccharides)","amount":"1000mg"}],"otherIngredients":"Organic capsule (pullulan, water), organic pea starch.","dosage":"Take 2 capsules daily.","servings":30}'::jsonb, updated_at = now() where slug = 'lions-mane';

-- Part 3: hide Berberine Complex until a 500 mg berberine HCl source is confirmed (Supliful's is ~146 mg/day)
update products set status = 'hidden', updated_at = now() where slug = 'berberine-complex';

-- Part 4: new prices (one-time per bottle; subscribe and 3-pack are $5 less, 6-pack $10 less). Then run the Stripe sync (Admin -> Products -> Sync to Stripe).
update products set data = jsonb_set(data, '{basePrice}', to_jsonb(v.price)), updated_at = now()
from (values
  ('magnesium-complex', 32),
  ('ashwagandha', 32),
  ('lions-mane', 40),
  ('turmeric-complex', 36),
  ('creatine', 34),
  ('coq10', 32),
  ('probiotic-complex', 38),
  ('glucosamine-complex', 36),
  ('collagen-complex', 34),
  ('menopause-complex', 38),
  ('zinc', 22),
  ('iron-complex', 24),
  ('vitamin-d3-k2', 26),
  ('biotin-complex', 28),
  ('niacinamide', 32),
  ('mushroom-blend-powder', 42),
  ('l-theanine', 26),
  ('nac', 28),
  ('berberine-complex', 36),
  ('odorless-garlic', 26),
  ('sleep-calm-stack', 55),
  ('gut-immunity-reset', 74),
  ('joint-support-trio', 89)
) as v(slug, price)
where products.slug = v.slug;
