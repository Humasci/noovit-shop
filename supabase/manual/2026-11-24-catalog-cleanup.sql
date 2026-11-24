-- Catalog clean-up from the launch audit (24 Nov 2026). Run in the Supabase SQL editor, then save any product in
-- Admin (cache) and press "Sync all to Stripe" once Stripe is live.

-- 1. Hide products whose supplier and formula aren't confirmed yet.
update products set status = 'hidden', updated_at = now() where slug in ('zinc', 'multivitamin', 'gut-immunity-reset');

-- 2. Shellfish warnings: glucosamine is made from crustacean shells.
update products set data = data || jsonb_build_object(
  'whoFor', 'Active people, runners, and anyone who wants to keep joints moving comfortably. Not for anyone with a shellfish allergy.',
  'otherIngredients', 'Vegetable capsule (HPMC). Contains: shellfish (glucosamine is made from crustacean shells).'
), updated_at = now() where slug = 'glucosamine-complex';

update products set data = data || jsonb_build_object(
  'whoFor', 'Active people, runners and anyone who wants to keep moving comfortably. Not for anyone with a shellfish allergy.',
  'otherIngredients', 'Contains: shellfish (in Glucosamine Joint+ and Turmeric Complex). See each product page for full Supplement Facts and allergen information.'
), updated_at = now() where slug = 'joint-support-trio';

-- Check:
select slug, status, data->>'otherIngredients' as other from products
where slug in ('zinc', 'multivitamin', 'gut-immunity-reset', 'glucosamine-complex', 'joint-support-trio');
