-- Identity & commerce (docs/04)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone_e164 text,
  whatsapp_opt_in boolean not null default false,
  role text not null default 'alumno' check (role in ('alumno','directora','admin')),
  city text,
  locale text not null default 'es' check (locale in ('es','en')),
  created_at timestamptz not null default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('directora','admin'));
$$;

-- new auth user → profile row
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.plans (
  id text primary key check (id in ('curso','soporte','mentoria')),
  name text not null,
  price_cents integer not null,
  stripe_price_id text,
  whatsapp_access text not null default 'none' check (whatsapp_access in ('none','season','year')),
  group_sessions boolean not null default false,
  calls_per_month integer not null default 0,
  return_reviews integer not null default 0,
  seats integer
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  locale text not null default 'es',
  published_at timestamptz
);

create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  plan_id text not null references public.plans(id),
  stripe_session_id text unique,
  stripe_customer_id text,
  amount_cents integer not null,
  status text not null default 'paid' check (status in ('paid','refunded')),
  purchased_at timestamptz not null default now()
);

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  plan_id text not null references public.plans(id),
  name text not null,
  seats integer not null,
  starts_at date
);
create table public.cohort_members (
  cohort_id uuid references public.cohorts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  primary key (cohort_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.courses enable row level security;
alter table public.purchases enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;

create policy "profile: own or staff read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profile: own update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select p.role from public.profiles p where p.id = auth.uid()));
create policy "plans: public read" on public.plans for select using (true);
create policy "courses: published read" on public.courses for select using (published_at is not null or public.is_staff());
create policy "purchases: own or staff read" on public.purchases for select using (user_id = auth.uid() or public.is_staff());
create policy "cohorts: staff" on public.cohorts for all using (public.is_staff()) with check (public.is_staff());
create policy "cohort_members: own or staff" on public.cohort_members for select using (user_id = auth.uid() or public.is_staff());
-- purchases are written only by the Stripe webhook with the service role (bypasses RLS)
