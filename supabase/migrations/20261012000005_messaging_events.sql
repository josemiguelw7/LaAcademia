create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  wa_phone text not null unique,
  last_message_at timestamptz
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  author text not null check (author in ('alumno','asistente','liliana')),  -- drives rendering: bot vs Liliana always distinguishable
  body text not null,
  lesson_ref text,
  wa_message_id text unique,
  created_at timestamptz not null default now()
);
create table public.escalations (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  message_id uuid references public.messages(id),
  question_text text not null,
  lesson_ref text,
  status text not null default 'abierta' check (status in ('abierta','respondida')),
  answered_by uuid references public.profiles(id),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  props jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.escalations enable row level security;
alter table public.events enable row level security;
create policy "conversations: own or staff" on public.conversations for select using (user_id = auth.uid() or public.is_staff());
create policy "messages: own or staff" on public.messages for select using (exists (select 1 from public.conversations c where c.id = conversation_id and (c.user_id = auth.uid() or public.is_staff())));
create policy "escalations: staff" on public.escalations for all using (public.is_staff()) with check (public.is_staff());
create policy "events: own insert" on public.events for insert with check (user_id = auth.uid());
create policy "events: staff read" on public.events for select using (public.is_staff());
