-- Price update (31 Oct 2026) after Supliful's delivered costs. Run ONCE in Supabase -> SQL Editor. Safe to re-run.
-- Creatine $32 (subscribe $27), Ashwagandha Calm+ $29 (subscribe $24). Then save any product and Sync to Stripe.
update products set data = jsonb_set(data, '{basePrice}', to_jsonb(v.price)), updated_at = now()
from (values ('creatine', 32), ('ashwagandha', 29)) as v(slug, price)
where products.slug = v.slug;
