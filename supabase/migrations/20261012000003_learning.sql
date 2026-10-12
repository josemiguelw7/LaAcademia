create table public.lesson_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  status text not null default 'bloqueada' check (status in ('bloqueada','disponible','en_progreso','dominada')),
  best_score integer, last_score integer, attempts integer not null default 0, mastered_at timestamptz,
  primary key (user_id, lesson_id)
);
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  started_at timestamptz not null default now(), finished_at timestamptz,
  score integer, passed boolean
);
create table public.attempt_answers (
  attempt_id uuid references public.attempts(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  option_id uuid references public.options(id),
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  primary key (attempt_id, question_id)
);
create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  case_id uuid not null references public.practice_cases(id) on delete cascade,
  submitted jsonb not null, correct_boxes integer, total_boxes integer,
  finished_at timestamptz not null default now()
);
create table public.streaks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_days integer not null default 0, longest_days integer not null default 0, last_active_date date
);
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  number text unique not null,              -- 'LA-2027-00001'
  issued_at timestamptz not null default now(),
  pdf_path text, share_image_path text
);

do $$ declare t text; begin
  foreach t in array array['lesson_progress','attempts','attempt_answers','practice_attempts','streaks','certificates'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Students read their own state; writes go through server functions (service role) so the unlock rule can't be bypassed.
create policy "progress: own or staff" on public.lesson_progress for select using (user_id = auth.uid() or public.is_staff());
create policy "attempts: own or staff" on public.attempts for select using (user_id = auth.uid() or public.is_staff());
create policy "answers: own or staff" on public.attempt_answers for select using (exists (select 1 from public.attempts a where a.id = attempt_id and (a.user_id = auth.uid() or public.is_staff())));
create policy "practice_attempts: own or staff" on public.practice_attempts for select using (user_id = auth.uid() or public.is_staff());
create policy "streaks: own or staff" on public.streaks for select using (user_id = auth.uid() or public.is_staff());
create policy "certificates: own or staff" on public.certificates for select using (user_id = auth.uid() or public.is_staff());

create index on public.attempts (user_id, lesson_id);
create index on public.attempt_answers (question_id, answered_at);
