-- Security advisor fixes: pin function search paths, and keep Supabase's own RLS helper off the public API.

alter function set_updated_at() set search_path = public, pg_temp;
alter function create_order(jsonb, jsonb, text) set search_path = public, pg_temp;
alter function track_affiliate_click(text) set search_path = public, pg_temp;

do $$
begin
  if exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'rls_auto_enable')
     and exists (select 1 from pg_roles where rolname = 'anon') then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
