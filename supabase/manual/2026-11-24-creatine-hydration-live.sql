-- Creatine Hydration+ goes live (24 Nov 2026). The page matches Supliful's Creatine Hydration Powder exactly
-- (5 g creatine, 1,000 mg sodium, 200 mg potassium, 60 mg magnesium, lemon, 300 g, 30 servings). Price $36
-- (Supliful suggests $42; cost on Pro ≈ $9.85 product + ~$7 shipping/fulfilment/processing ≈ $17 → ~$17.80 left).
-- Run in the Supabase SQL editor (Noovit project), then save any product in Admin and Sync all to Stripe.
-- If the check below returns no row, the product isn't in the live catalog yet: Admin → Products → Import launch catalog.
update products set status = 'active', data = jsonb_set(data, '{basePrice}', '36'::jsonb), updated_at = now()
where slug = 'creatine-hydration';

select slug, status, data->>'basePrice' as price from products where slug = 'creatine-hydration';
