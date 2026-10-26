-- Noovit store schema. Stripe is the source of truth for money; these tables track
-- operational state (orders, fulfilment, subscriptions mirror, reviews).
-- All access goes through the server with the service-role key, so RLS is enabled
-- with no policies: the public anon key can read/write nothing.

create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id),
  stripe_subscription_id text not null unique,
  status text not null,
  frequency_days int not null check (frequency_days in (30, 60, 90)),
  amount_cents int not null default 0,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  paused boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint generated always as identity (start with 1001) unique,
  customer_id uuid references customers(id),
  subscription_id uuid references subscriptions(id),
  kind text not null check (kind in ('one_time', 'subscription_initial', 'subscription_renewal')),
  status text not null default 'paid'
    check (status in ('paid', 'fulfilling', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded')),
  email text not null,
  currency text not null default 'usd',
  subtotal_cents int not null,
  discount_cents int not null default 0,
  tax_cents int not null default 0,
  shipping_cents int not null default 0,
  total_cents int not null,
  shipping_name text,
  shipping_address jsonb,
  age_confirmed boolean not null default false,
  stripe_checkout_session_id text unique,
  stripe_invoice_id text unique,
  stripe_payment_intent_id text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  purchase_mode text not null check (purchase_mode in ('one-time', 'subscribe')),
  bottles int not null check (bottles > 0),
  frequency_days int check (frequency_days in (30, 60, 90)),
  unit_amount_cents int not null,
  quantity int not null check (quantity > 0),
  stripe_price_id text,
  supplier_sku text
);

create table fulfilments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  supplier text not null,
  status text not null default 'queued'
    check (status in ('queued', 'submitted', 'accepted', 'shipped', 'delivered', 'failed', 'cancelled')),
  supplier_order_ref text,
  carrier text,
  tracking_number text,
  tracking_url text,
  error text,
  submitted_at timestamptz,
  shipped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  customer_id uuid references customers(id),
  name text not null,
  email text not null,
  rating int not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verified_buyer boolean not null default false,
  created_at timestamptz not null default now()
);

-- Webhook idempotency: each Stripe event is processed once.
create table stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

-- Creates an order, its items and a queued fulfilment atomically.
-- Unique violations (duplicate session/invoice) surface as 23505 so callers can treat them as "already done".
create or replace function create_order(p_order jsonb, p_items jsonb, p_supplier text)
returns table (order_id uuid, order_no bigint)
language plpgsql as $$
declare
  v_id uuid;
  v_num bigint;
begin
  insert into orders (kind, customer_id, subscription_id, email, currency, subtotal_cents, discount_cents, tax_cents,
                      shipping_cents, total_cents, shipping_name, shipping_address, age_confirmed,
                      stripe_checkout_session_id, stripe_invoice_id, stripe_payment_intent_id)
  select r.kind, r.customer_id, r.subscription_id, r.email, r.currency, r.subtotal_cents, r.discount_cents, r.tax_cents,
         r.shipping_cents, r.total_cents, r.shipping_name, r.shipping_address, coalesce(r.age_confirmed, false),
         r.stripe_checkout_session_id, r.stripe_invoice_id, r.stripe_payment_intent_id
  from jsonb_populate_record(null::orders, p_order) r
  returning orders.id, orders.order_number into v_id, v_num;

  insert into order_items (order_id, product_slug, product_name, purchase_mode, bottles, frequency_days,
                           unit_amount_cents, quantity, stripe_price_id, supplier_sku)
  select v_id, i.product_slug, i.product_name, i.purchase_mode, i.bottles, i.frequency_days,
         i.unit_amount_cents, i.quantity, i.stripe_price_id, i.supplier_sku
  from jsonb_populate_recordset(null::order_items, p_items) i;

  insert into fulfilments (order_id, supplier) values (v_id, p_supplier);

  return query select v_id, v_num;
end;
$$;

revoke all on function create_order(jsonb, jsonb, text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function create_order(jsonb, jsonb, text) from anon, authenticated;
  end if;
end $$;

create index orders_customer_idx on orders (customer_id);
create index orders_created_idx on orders (created_at desc);
create index orders_status_idx on orders (status);
create index order_items_order_idx on order_items (order_id);
create index fulfilments_order_idx on fulfilments (order_id);
create index fulfilments_status_idx on fulfilments (status);
create index subscriptions_customer_idx on subscriptions (customer_id);
create index reviews_product_status_idx on reviews (product_slug, status);

create trigger customers_updated_at before update on customers for each row execute function set_updated_at();
create trigger subscriptions_updated_at before update on subscriptions for each row execute function set_updated_at();
create trigger orders_updated_at before update on orders for each row execute function set_updated_at();
create trigger fulfilments_updated_at before update on fulfilments for each row execute function set_updated_at();

alter table customers enable row level security;
alter table subscriptions enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table fulfilments enable row level security;
alter table reviews enable row level security;
alter table stripe_events enable row level security;
