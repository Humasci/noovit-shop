-- V2 labels (3 Nov 2026): the core range's deeper, muted colours (site + product images). Run ONCE in Supabase ->
-- SQL Editor. Safe to re-run. Afterwards save any product in Admin (refreshes the cache).
update products set data = data || jsonb_build_object('color', c.color), updated_at = now()
from (values
  ('magnesium-complex', '#4A6B94'), ('ashwagandha', '#AE5559'), ('lions-mane', '#2B7C82'),
  ('creatine', '#2F6F4E'), ('coq10', '#8E2E45'), ('turmeric-complex', '#B56E1E')
) as c(slug, color)
where products.slug = c.slug;
