-- Course content. Source of truth = content/*.mdx; written only by scripts/seed-content (service role).
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null,
  title text not null,
  description text,
  unique (course_id, position)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  code text unique not null,                -- '03-01' (MDX id)
  position integer not null,
  slug text not null,
  title text not null,
  objective text,
  duration_sec integer,
  status text not null default 'draft' check (status in ('draft','review','approved','recorded')),
  checklist jsonb not null default '[]',
  cifra_concepts text[] not null default '{}',
  practice_code text,
  mastery_threshold integer not null default 8,
  questions_per_attempt integer not null default 10,
  published_at timestamptz,
  unique (module_id, position)
);
create table public.segments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  position integer not null,
  title text not null,
  stream_video_id text,
  duration_sec integer,
  transcript text not null,
  unique (lesson_id, position)
);
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  segment_id uuid references public.segments(id) on delete set null,
  code text not null,                       -- 'q1'
  position integer not null,
  prompt text not null,
  concept_tag text not null,
  cifra_concept text,
  unique (lesson_id, code)
);
create table public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  letter text not null check (letter in ('a','b','c')),
  text text not null,
  is_correct boolean not null,
  feedback text not null,
  unique (question_id, letter)
);
create table public.practices (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                -- '06-anexo-c-rosa'
  module_id uuid references public.modules(id) on delete cascade,
  kind text not null check (kind in ('quiz','form','pdf')),
  title text not null,
  form_type text check (form_type in ('schedule_c','1040','w2') or form_type is null),
  tax_year integer,
  spec_md text,
  published_at timestamptz
);
create table public.practice_cases (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  position integer not null,
  title text not null,
  narrative text,
  documents jsonb not null default '[]'
);
create table public.practice_boxes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.practice_cases(id) on delete cascade,
  line_no text not null,
  label text not null,
  expected_expr text not null,              -- evaluated against cifras at grade time
  kind text not null check (kind in ('input','calc','choice')),
  note_on_error jsonb not null default '{}'
);

do $$ declare t text; begin
  foreach t in array array['modules','lessons','segments','questions','practices','practice_cases','practice_boxes'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
alter table public.options enable row level security;

-- Students read published content; staff read everything (incl. drafts for Liliana's review).
create policy "modules: read" on public.modules for select using (auth.uid() is not null);
create policy "lessons: read" on public.lessons for select using (published_at is not null or public.is_staff());
create policy "segments: read" on public.segments for select using (exists (select 1 from public.lessons l where l.id = lesson_id and (l.published_at is not null or public.is_staff())));
create policy "questions: read" on public.questions for select using (exists (select 1 from public.lessons l where l.id = lesson_id and (l.published_at is not null or public.is_staff())));
-- options are NOT readable by students directly (is_correct/feedback would leak); grading goes through grade_answer()
create policy "options: staff read" on public.options for select using (public.is_staff());
create policy "practices: read" on public.practices for select using (published_at is not null or public.is_staff());
create policy "practice_cases: read" on public.practice_cases for select using (exists (select 1 from public.practices p where p.id = practice_id and (p.published_at is not null or public.is_staff())));
create policy "practice_boxes: staff read" on public.practice_boxes for select using (public.is_staff());

-- Student-safe view of options (no answer key)
create view public.options_public with (security_invoker = false) as
  select o.id, o.question_id, o.letter, o.text
  from public.options o join public.questions q on q.id = o.question_id join public.lessons l on l.id = q.lesson_id
  where l.published_at is not null;
grant select on public.options_public to authenticated;
