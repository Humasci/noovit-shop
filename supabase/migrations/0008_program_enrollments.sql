-- Free email programs (24 Nov 2026): who joined which program, when, and how many of its emails they've had.
-- The daily cron (/api/cron/daily) sends the next email when it's due (lib/marketing/programs.ts).
-- Separate from subscribers, so an existing newsletter subscriber can still join a program.
create table if not exists program_enrollments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  program text not null,
  started_at timestamptz not null default now(),
  last_step smallint not null default 0,
  last_sent_at timestamptz,
  completed_at timestamptz,
  unique (email, program)
);
create index if not exists program_enrollments_due_idx on program_enrollments (program, started_at) where completed_at is null;
alter table program_enrollments enable row level security;
