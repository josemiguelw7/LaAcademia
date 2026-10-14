-- La lección abierta como demo para quien crea cuenta sin comprar (aprobado por Liliana el 13 oct 2026).
insert into public.settings (key, value) values ('demo_lesson_code', '"03-01"'::jsonb)
on conflict (key) do nothing;
