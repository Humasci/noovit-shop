-- 20 Nov 2026: new label colours for the women's range (owner: more variety). Run in the Supabase SQL editor, then
-- save any product in Admin (cache) and run Stripe sync. Website images refresh on their own (MOCKUP_VERSION bump).
update products set data = jsonb_set(data, '{color}', '"#6F9468"'), updated_at = now() where slug = 'menopause-complex'; -- sage
update products set data = jsonb_set(data, '{color}', '"#D2483C"'), updated_at = now() where slug = 'iron-complex';      -- red
update products set data = jsonb_set(data, '{color}', '"#E86AA6"'), updated_at = now() where slug = 'collagen-complex';  -- magenta
update products set data = jsonb_set(data, '{color}', '"#8F7BC8"'), updated_at = now() where slug = 'biotin-complex';    -- indigo
