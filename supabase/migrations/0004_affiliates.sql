-- Affiliates & influencers: one personal code + share link each, commissions on attributed orders.

create table affiliates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  code text not null unique check (code ~ '^[A-Z0-9_-]{3,30}$'),
  platform text,                 -- e.g. "Instagram @handle"
  customer_discount_pct int not null default 10 check (customer_discount_pct between 0 and 50),
  commission_pct numeric(5,2) not null default 15 check (commission_pct between 0 and 50),
  recurring boolean not null default false, -- also earn on subscription renewals
  status text not null default 'active' check (status in ('active', 'paused')),
  payout_details text,           -- PayPal email, bank note etc. (never card numbers)
  notes text,
  stripe_coupon_id text,
  stripe_promotion_code_id text unique,
  portal_token text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table affiliate_payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id) on delete cascade,
  amount_cents int not null check (amount_cents > 0),
  method text,
  reference text,
  paid_by text,
  created_at timestamptz not null default now()
);

create table commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id) on delete cascade,
  order_id uuid not null unique references orders(id) on delete cascade,
  source text not null check (source in ('code', 'link', 'renewal')),
  base_cents int not null,       -- merchandise after discount and refunds (no tax/shipping)
  rate_pct numeric(5,2) not null,
  amount_cents int not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'void')),
  void_reason text,
  approved_at timestamptz,
  payout_id uuid references affiliate_payouts(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table orders add column affiliate_id uuid references affiliates(id) on delete set null;
alter table subscriptions add column affiliate_id uuid references affiliates(id) on delete set null;

create index commissions_affiliate_idx on commissions (affiliate_id, status);
create index commissions_pending_idx on commissions (created_at) where status = 'pending';
create index orders_affiliate_idx on orders (affiliate_id) where affiliate_id is not null;

create trigger affiliates_updated_at before update on affiliates for each row execute function set_updated_at();

-- Click counter for share links (atomic increment from the server).
create or replace function track_affiliate_click(p_code text) returns void
language sql as $$
  update affiliates set clicks = clicks + 1 where code = upper(p_code) and status = 'active';
$$;

revoke all on function track_affiliate_click(text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function track_affiliate_click(text) from anon, authenticated;
  end if;
end $$;

alter table affiliates enable row level security;
alter table affiliate_payouts enable row level security;
alter table commissions enable row level security;
