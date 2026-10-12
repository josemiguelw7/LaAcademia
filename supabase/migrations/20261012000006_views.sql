-- Directora panel views (security_invoker: RLS of the caller applies → only staff see all rows)
create view public.v_failed_questions_30d with (security_invoker = true) as
  select q.id as question_id, l.code as lesson_code, q.code as question_code, q.prompt, q.concept_tag,
         count(*) as answers,
         round(100.0 * avg(case when aa.is_correct then 0 else 1 end), 1) as fail_pct
  from public.attempt_answers aa
  join public.questions q on q.id = aa.question_id
  join public.lessons l on l.id = q.lesson_id
  where aa.answered_at > now() - interval '30 days'
  group by q.id, l.code, q.code, q.prompt, q.concept_tag;

create view public.v_students with (security_invoker = true) as
  select p.id, p.full_name, p.phone_e164,
         (select pu.plan_id from public.purchases pu where pu.user_id = p.id and pu.status = 'paid' order by pu.purchased_at desc limit 1) as plan_id,
         (select count(*) from public.lesson_progress lp where lp.user_id = p.id and lp.status = 'dominada') as lessons_mastered,
         (select max(a.started_at) from public.attempts a where a.user_id = p.id) as last_activity,
         coalesce((select max(a.started_at) from public.attempts a where a.user_id = p.id) < now() - interval '7 days', true) as inactive_7d
  from public.profiles p where p.role = 'alumno';

create view public.v_inbox with (security_invoker = true) as
  select e.id, e.question_text, e.lesson_ref, e.created_at, now() - e.created_at as age,
         c.user_id, p.full_name
  from public.escalations e join public.conversations c on c.id = e.conversation_id
  left join public.profiles p on p.id = c.user_id
  where e.status = 'abierta';
