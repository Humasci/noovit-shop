-- Launch audit fixes.

-- Only orders that were actually exported to the supplier can be marked as submitted.

alter table fulfilments add column if not exists exported_at timestamptz;
create index if not exists fulfilments_status_idx on fulfilments (status, created_at);

-- Failed admin sign-ins, for rate limiting (per IP and per email, rolling 15 minutes).
create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  key text not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_key_idx on login_attempts (key, created_at);
alter table login_attempts enable row level security;
