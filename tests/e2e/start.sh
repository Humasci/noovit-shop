#!/bin/bash
S="$(cd "$(dirname "$0")" && pwd)"
rm -rf "$S/storage"
(cd "$S" && node db-server.mjs ../../supabase/migrations/0001_init.sql ../../supabase/migrations/0002_catalog_marketing.sql ../../supabase/migrations/0003_phase2.sql ../../supabase/migrations/0004_affiliates.sql ../../supabase/migrations/0005_hardening.sql ../../supabase/migrations/0006_launch_audit.sql ../../supabase/migrations/0007_subscriber_goal.sql > db.log 2>&1 &)
sleep 4
("$S/bin/postgrest" "$S/postgrest.conf" > "$S/pgrst.log" 2>&1 &)
(cd "$S" && node fake-stripe.mjs > fake.log 2>&1 &)
sleep 3
cd "$S/../.." && (set -a; . "$S/test.env"; set +a; npx next start -p 3100 > "$S/next.log" 2>&1 &)
sleep 6
tail -2 "$S/db.log"; tail -1 "$S/pgrst.log"; curl -s -o /dev/null -w "app %{http_code}\n" localhost:3100/
