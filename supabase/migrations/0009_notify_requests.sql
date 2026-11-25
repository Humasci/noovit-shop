-- "Notify me" list (26 Nov 2026): every product or test kit someone asked to hear about, one row each, so the account
-- page can list them all and the launch emails can say exactly what opened. (subscribers.goal only keeps the last one.)
create table if not exists notify_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null check (kind in ('product', 'kit')),
  slug text not null check (char_length(slug) <= 60),
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  unique (email, kind, slug)
);
create index if not exists notify_requests_open_idx on notify_requests (kind, slug) where notified_at is null;
alter table notify_requests enable row level security;

-- Carry over the requests saved so far (one per person, in subscribers.goal).
insert into notify_requests (email, kind, slug, created_at)
  select s.email, 'product', s.goal, s.created_at from subscribers s
  where s.source = 'launch-waitlist' and s.goal is not null and s.status = 'subscribed'
    and exists (select 1 from products p where p.slug = s.goal)
on conflict do nothing;
insert into notify_requests (email, kind, slug, created_at)
  select s.email, 'kit', s.goal, s.created_at from subscribers s
  where s.source = 'tests-waitlist' and s.goal is not null and s.status = 'subscribed'
on conflict do nothing;
