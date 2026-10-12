-- Single source of tax figures. Nothing in code, copy or video.
create table public.cifras (
  id uuid primary key default gen_random_uuid(),
  tax_year integer not null,
  concept text not null,
  filing_status text,                       -- null = applies to all
  variant text,                             -- e.g. '1_hijo', 'ene-jun'
  value numeric not null,
  unit text not null check (unit in ('usd','pct','usd_per_mile','usd_per_sqft','count')),
  label_es text not null,
  label_en text,
  source_url text not null,
  effective_from date,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  notes text,
  unique nulls not distinct (tax_year, concept, filing_status, variant)
);
create table public.settings (key text primary key, value jsonb not null);

alter table public.cifras enable row level security;
alter table public.settings enable row level security;
-- Students only see figures Liliana verified; staff see and edit all.
create policy "cifras: verified read" on public.cifras for select using (verified_at is not null or public.is_staff());
create policy "cifras: staff write" on public.cifras for all using (public.is_staff()) with check (public.is_staff());
create policy "settings: read" on public.settings for select using (true);
create policy "settings: staff write" on public.settings for all using (public.is_staff()) with check (public.is_staff());
