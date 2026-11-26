-- Launch price rise (26 Nov 2026, owner approved). Supliful's real cost per order is product + $1.99 fulfilment +
-- 2.99% + shipping (~$5.29), so single-bottle subscriptions were too thin (~$10). Three products had room under the
-- identical-formula competitors (Fernwood magnesium $39.99, Cortex CoQ10 $39.99, Kinetic creatine $44.99):
--   Magnesium Sleep+ $29 → $32 · CoQ10 $28 → $32 · Creatine and Creatine for Her $32 → $34 (+ the hidden men's twins).
-- Stacks containing them move up to stay about 15% under their parts:
--   Sleep & Calm $49 → $52 · Strength / Strength for Her / Strength for Men $52 → $56 · Focus $54 → $57.
-- Subscribe and packs follow automatically (−$5 / −$10 per bottle). Ashwagandha, Lion's Mane, Turmeric unchanged.
-- Run in the Supabase SQL editor (Noovit project), then Admin → save any product → Products → Sync all to Stripe.

update products set data = jsonb_set(data, '{basePrice}', to_jsonb(v.price)), updated_at = now()
from (values
  ('magnesium-complex', 32), ('magnesium-for-men', 32),
  ('coq10', 32),
  ('creatine', 34), ('creatine-for-women', 34), ('creatine-for-men', 34),
  ('sleep-calm-stack', 52),
  ('strength-stack', 56), ('her-strength-stack', 56), ('men-strength-stack', 56),
  ('focus-stack', 57)
) as v(slug, price)
where products.slug = v.slug;

-- Check: the new prices (rows only appear for products in the live catalog).
select slug, status, data->>'basePrice' as price from products
where slug in ('magnesium-complex', 'magnesium-for-men', 'coq10', 'creatine', 'creatine-for-women', 'creatine-for-men',
               'sleep-calm-stack', 'strength-stack', 'her-strength-stack', 'men-strength-stack', 'focus-stack')
order by slug;
