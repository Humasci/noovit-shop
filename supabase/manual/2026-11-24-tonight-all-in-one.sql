-- ONE paste for tonight (24 Nov 2026): price fix + hide unconfirmed products + Creatine Hydration+ live.
-- Run in the Supabase SQL editor (Noovit project). Then: Admin → save any product → Products → Sync all to Stripe.

-- ===== 2026-11-24-price-fix.sql =====
-- Price check before the Stripe sync (24 Nov 2026). The 31 Oct price SQL was never run on the live catalog:
-- live Creatine is $29 and Ashwagandha Calm+ $27, but the agreed launch prices are $32 and $29 (docs/PRICE_LIST.md;
-- Creatine for Her is already $32, the same powder). Also fixes the creatine FAQ that still says "About 56 servings".
-- Run in the Supabase SQL editor (Noovit project), then save any product in Admin, then press "Sync all to Stripe".

update products set data = jsonb_set(data, '{basePrice}', to_jsonb(v.price)), updated_at = now()
from (values ('creatine', 32), ('ashwagandha', 29)) as v(slug, price)
where products.slug = v.slug;

update products set data = data || jsonb_build_object(
  'servings', 50,
  'netWeight', '281 g (9.9 oz)',
  'extraFaqs', '[{"q":"How many servings are in a tub?","a":"50 servings of 5 g creatine (one 5.6 g scoop), in a 281 g tub."}]'::jsonb
), updated_at = now() where slug = 'creatine';

-- Check: expect creatine 32 (50 servings) and ashwagandha 29.
select slug, data->>'basePrice' as price, data->>'servings' as servings from products where slug in ('creatine', 'ashwagandha');

-- ===== 2026-11-24-hide-unconfirmed.sql =====
-- Hide products whose page doesn't match a real Supliful product yet (24 Nov 2026, owner's Supliful check).
-- Iron and Biotin don't exist on Supliful; Glucosamine Joint+ is really Supliful's "Joint Support" (vegan glucosamine,
-- different formula); Collagen Glow+ is really the Grass-Fed Hydrolyzed Collagen Peptides powder (not capsules);
-- Menopause Balance+ is "Women's Vitality" (different herbs); Vitamin D3 & K2 is "Bone & Heart Support" (adds calcium);
-- Probiotic Gut+ needs the "Probiotic 40 Billion with Prebiotics" facts panel; Mushroom Clarity+ isn't matched.
-- Each comes back once its page is rewritten from the real Supplement Facts and its delivered cost is known.
-- Run in the Supabase SQL editor (Noovit project), then save any product in Admin.
update products set status = 'hidden', updated_at = now()
where slug in ('probiotic-complex', 'glucosamine-complex', 'collagen-complex', 'menopause-complex', 'iron-complex',
               'vitamin-d3-k2', 'biotin-complex', 'mushroom-blend-powder', 'joint-support-trio');

-- Check: all nine should say hidden.
select slug, status from products where slug in ('probiotic-complex', 'glucosamine-complex', 'collagen-complex',
  'menopause-complex', 'iron-complex', 'vitamin-d3-k2', 'biotin-complex', 'mushroom-blend-powder', 'joint-support-trio');

-- ===== 2026-11-24-creatine-hydration-live.sql =====
-- Creatine Hydration+ goes live (24 Nov 2026). The page matches Supliful's Creatine Hydration Powder exactly
-- (5 g creatine, 1,000 mg sodium, 200 mg potassium, 60 mg magnesium, lemon, 300 g, 30 servings). Price $36
-- (Supliful suggests $42; Pro tier-1 cost $9.85 with delivery included, per the owner → ~$24.80 left after the card fee).
-- Run in the Supabase SQL editor (Noovit project), then save any product in Admin and Sync all to Stripe.
-- If the check below returns no row, the product isn't in the live catalog yet: Admin → Products → Import launch catalog.
update products set status = 'active', data = jsonb_set(data, '{basePrice}', '36'::jsonb), updated_at = now()
where slug = 'creatine-hydration';

select slug, status, data->>'basePrice' as price from products where slug = 'creatine-hydration';

