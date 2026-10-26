-- Phase 2: staff accounts, order/customer tooling, collections, blog, review requests.

create table staff (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role text not null check (role in ('owner', 'manager', 'fulfilment')),
  password_hash text not null,
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  staff_id uuid references staff(id) on delete set null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table orders add column tags text[] not null default '{}';
alter table orders add column refunded_cents int not null default 0;
alter table orders add column cancelled_at timestamptz;
alter table orders drop constraint orders_kind_check;
alter table orders add constraint orders_kind_check
  check (kind in ('one_time', 'subscription_initial', 'subscription_renewal', 'manual'));

alter table customers add column notes text;
alter table customers add column tags text[] not null default '{}';

alter table fulfilments add column review_requested_at timestamptz;

create table collections (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  image text,
  product_slugs text[] not null default '{}',
  status text not null default 'hidden' check (status in ('active', 'hidden')),
  seo_title text,
  seo_description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table posts (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_image text,
  author text not null default 'Noovit',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index order_notes_order_idx on order_notes (order_id, created_at);
create index orders_tags_idx on orders using gin (tags);
create index customers_tags_idx on customers using gin (tags);
create index posts_published_idx on posts (status, published_at desc);
create index fulfilments_review_idx on fulfilments (status, shipped_at) where review_requested_at is null;

create trigger staff_updated_at before update on staff for each row execute function set_updated_at();
create trigger collections_updated_at before update on collections for each row execute function set_updated_at();
create trigger posts_updated_at before update on posts for each row execute function set_updated_at();

alter table staff enable row level security;
alter table order_notes enable row level security;
alter table collections enable row level security;
alter table posts enable row level security;
