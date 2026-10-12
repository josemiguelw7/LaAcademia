"""Genera supabase/seed/content.sql a partir de content/lessons/*.mdx y content/practices/*.md.
Idempotente: borra y recrea el curso 'preparador-de-impuestos'. Uso: python3 scripts/build-content-seed.py"""
import glob, re, yaml, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODULES = {1:"Fundamentos",2:"Registro y ética",3:"La familia fiscal",4:"Ingresos",
           5:"Deducciones y créditos",6:"El Anexo C",7:"Errores y cartas del IRS",8:"Tu primera temporada"}
def q(s):
    if s is None: return "null"
    s = str(s); assert "$lm$" not in s
    return f"$lm${s}$lm$"

out = ["-- GENERADO por scripts/build-content-seed.py — no editar a mano", "begin;",
       "delete from public.courses where slug = 'preparador-de-impuestos';",
       "insert into public.courses (slug, title, locale) values ('preparador-de-impuestos', 'Preparador de impuestos', 'es');"]
for n, t in MODULES.items():
    out.append(f"insert into public.modules (course_id, position, title) select id, {n}, {q(t)} from public.courses where slug='preparador-de-impuestos';")

def mod(n): return f"(select m.id from public.modules m join public.courses c on c.id=m.course_id where c.slug='preparador-de-impuestos' and m.position={n})"

for f in sorted(glob.glob(str(ROOT/'content/lessons/**/*.mdx'), recursive=True)):
    fm_txt, body = re.match(r'^---\n(.*?)\n---\n(.*)$', open(f, encoding='utf-8').read(), re.S).groups()
    fm = yaml.safe_load(fm_txt)
    code = fm['id']; L = f"(select id from public.lessons where code='{code}')"
    out.append(f"insert into public.lessons (module_id, code, position, slug, title, objective, duration_sec, status, checklist, cifra_concepts, practice_code) values "
               f"({mod(fm['module'])}, '{code}', {fm['lesson']}, {q(fm['slug'])}, {q(fm['title'])}, {q(fm['objective'])}, {int(fm['duration_min'])*60}, '{fm['status']}', "
               f"{q(json.dumps(fm.get('checklist') or [], ensure_ascii=False))}::jsonb, array[{','.join(q(c) for c in (fm.get('cifras') or []))}]::text[], {q(fm.get('practice'))});")
    parts = re.split(r'^## S(\d+) · (.+)$', body, flags=re.M)
    for i in range(1, len(parts), 3):
        out.append(f"insert into public.segments (lesson_id, position, title, transcript) values ({L}, {int(parts[i])}, {q(parts[i+1].strip())}, {q(parts[i+2].strip())});")
    for pos, qu in enumerate(fm.get('questions') or [], 1):
        seg = f"(select s.id from public.segments s where s.lesson_id={L} and s.position={int(qu['after_segment'])})"
        out.append(f"insert into public.questions (lesson_id, segment_id, code, position, prompt, concept_tag) values ({L}, {seg}, '{qu['id']}', {pos}, {q(qu['prompt'])}, {q(qu['concept_tag'])});")
        Q = f"(select id from public.questions where lesson_id={L} and code='{qu['id']}')"
        for o in qu['options']:
            out.append(f"insert into public.options (question_id, letter, text, is_correct, feedback) values ({Q}, '{o['id']}', {q(o['text'])}, {str(bool(o.get('correct'))).lower()}, {q(o['feedback'])});")

for f in sorted(glob.glob(str(ROOT/'content/practices/*.md'))):
    fm_txt, body = re.match(r'^---\n(.*?)\n---\n(.*)$', open(f, encoding='utf-8').read(), re.S).groups()
    fm = yaml.safe_load(fm_txt)
    kind = 'form' if fm['id'] in ('06-anexo-c-rosa','04-w2-a-1040') else 'quiz'
    form = {'06-anexo-c-rosa':'schedule_c','04-w2-a-1040':'1040'}.get(fm['id'])
    out.append(f"insert into public.practices (code, module_id, kind, title, form_type, tax_year, spec_md) values ({q(fm['id'])}, {mod(fm['module'])}, '{kind}', {q(fm['title'])}, {q(form)}, 2026, {q(body.strip())});")
for code, n, title in [('pdf-checklist-intake',2,'Lo que le pides a tu cliente'),('pdf-checklist-revision',7,'El checklist de 60 segundos')]:
    out.append(f"insert into public.practices (code, module_id, kind, title) values ('{code}', {mod(n)}, 'pdf', {q(title)});")
out.append("commit;")
p = ROOT/'supabase/seed/content.sql'; p.write_text("\n".join(out)+"\n", encoding='utf-8')
print(p, len(out), "statements")
