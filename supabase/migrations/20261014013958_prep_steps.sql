-- Preparación para la temporada: PTIN, EFIN y lo demás que el alumno tiene que tener listo.
-- Cada alumno marca sus pasos; la fecha recomendada para pedir el EFIN vive en settings.
create table public.prep_steps (
  user_id uuid not null references public.profiles(id) on delete cascade,
  step text not null check (step in ('ptin','eservices','efin_solicitud','huellas','efin_aprobado','taxact','plan_seguridad')),
  done_at timestamptz not null default now(),
  primary key (user_id, step)
);
alter table public.prep_steps enable row level security;
create policy "prep: own" on public.prep_steps for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "prep: staff read" on public.prep_steps for select to authenticated using (private.is_staff());

insert into public.settings (key, value) values ('efin_deadline', '"2026-11-15"'::jsonb)
on conflict (key) do nothing;
