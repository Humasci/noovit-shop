-- Core-5 price update (30 Oct 2026), from the competitor teardown (docs/research/COMPETITORS_CORE5.md).
-- Run ONCE in Supabase → SQL Editor. Safe to re-run.
-- One-time price per bottle; subscribe and 3-pack stay $5 less (≈15–19% off), 6-pack $10 less.
-- Sleep & Calm Stack drops to $49 so it stays cheaper than buying Magnesium Sleep+ and Ashwagandha Calm+ separately ($56).
-- Afterwards: Admin → Products → Sync to Stripe (creates the new Stripe prices), then save any product or redeploy.
update products set data = jsonb_set(data, '{basePrice}', to_jsonb(v.price)), updated_at = now()
from (values
  ('magnesium-complex', 29),
  ('ashwagandha', 27),
  ('lions-mane', 35),
  ('creatine', 29),
  ('coq10', 28),
  ('sleep-calm-stack', 49)
) as v(slug, price)
where products.slug = v.slug;
