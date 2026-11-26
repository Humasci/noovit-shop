-- Reviewer programme (26 Nov 2026): people we send free product to can review it through a personal invite link.
-- Their reviews carry this flag and show "Free sample" (FTC Endorsement Guides 16 CFR 255.5 and the
-- 2024 rule on consumer reviews, 16 CFR 465: free product must be disclosed; every rating is published).
alter table reviews add column if not exists free_product boolean not null default false;
