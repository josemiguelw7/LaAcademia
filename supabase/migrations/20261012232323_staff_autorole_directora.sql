-- (aplicada directo en Supabase el 12 oct 2026; se agrega al repo para que coincidan)
-- Cuando Liliana entre por primera vez, su perfil nace como directora.
create or replace function public.assign_staff_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_email text;
begin
  select lower(email) into v_email from auth.users where id = new.id;
  if v_email = 'liliana@lilianamiranda.com' then
    new.role := 'directora';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_staff_role on public.profiles;
create trigger trg_assign_staff_role
  before insert on public.profiles
  for each row execute function public.assign_staff_role();
