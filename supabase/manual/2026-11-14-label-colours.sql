-- Elegant dark labels (14 Nov 2026): CoQ10 moves to plum (it sat too close to Ashwagandha's burgundy) and Turmeric to
-- saffron gold (its label is gold on charcoal; the old orange read brown). Site tints and product images use these.
-- Run ONCE in Supabase -> SQL Editor. Safe to re-run. Afterwards save any product in Admin (refreshes the cache).
update products set data = data || jsonb_build_object('color', c.color), updated_at = now()
from (values ('coq10', '#7B3F86'), ('turmeric-complex', '#C98F14')) as c(slug, color)
where products.slug = c.slug;
