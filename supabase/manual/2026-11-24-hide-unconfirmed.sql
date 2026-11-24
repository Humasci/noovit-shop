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
