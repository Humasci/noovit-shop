-- US spelling in live product copy (7 Nov). The site uses US spelling; a few product texts still had UK spellings
-- (fibre, hydrolysed, (un)flavoured, flavour). Only those words change. Safe to re-run.
-- After running: Admin → save any product (refreshes the catalog cache).
update products
set data = replace(replace(replace(replace(replace(data::text,
  'fibre', 'fiber'),
  'Hydrolysed', 'Hydrolyzed'),
  'hydrolysed', 'hydrolyzed'),
  'flavour', 'flavor'),
  'Flavour', 'Flavor')::jsonb
where data::text ~ '(fibre|[Hh]ydrolysed|[Ff]lavour)';
