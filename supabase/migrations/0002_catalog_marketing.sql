-- Phase 1: editable catalog, store settings, newsletter, abandoned checkouts, product photos.

-- Catalog. `data` holds the editable product fields (see ProductData in types/index.ts).
create table products (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  data jsonb not null,
  status text not null default 'active' check (status in ('active', 'out_of_stock', 'hidden')),
  images text[] not null default '{}',
  seo_title text,
  seo_description text,
  supplier_sku text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Simple key/value store for settings editable in the admin (tracking IDs etc.).
create table settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'newsletter',
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table abandoned_checkouts (
  stripe_session_id text primary key,
  email text not null,
  amount_cents int not null default 0,
  currency text not null default 'usd',
  items jsonb not null default '[]',
  recovery_url text,
  email_sent_at timestamptz,
  recovered_at timestamptz,
  recovered_order_id uuid references orders(id),
  created_at timestamptz not null default now()
);

create index products_sort_idx on products (sort_order, slug);
create index subscribers_status_idx on subscribers (status);
create index abandoned_created_idx on abandoned_checkouts (created_at desc);

create trigger products_updated_at before update on products for each row execute function set_updated_at();
create trigger settings_updated_at before update on settings for each row execute function set_updated_at();

alter table products enable row level security;
alter table settings enable row level security;
alter table subscribers enable row level security;
alter table abandoned_checkouts enable row level security;

-- Public bucket for product photos (Supabase Storage). Skipped where the storage schema doesn't exist.
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
    on conflict (id) do nothing;
  end if;
end $$;
