-- options_public bypassed RLS; students get options through server code (service role) instead.
drop view if exists public.options_public;

-- Trigger function: never callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_staff() must stay executable for RLS policies, but out of the exposed API schema.
create schema if not exists private;
grant usage on schema private to anon, authenticated;
alter function public.is_staff() set schema private;
revoke execute on function private.is_staff() from public;
grant execute on function private.is_staff() to anon, authenticated;
