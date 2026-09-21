# 05 · Contenido y currículo

> **Actualización 21 sept 2026:** la estructura final de lecciones (8 módulos, 30 lecciones, fuentes por lección, correcciones al material original) está en [09-curriculo.md](09-curriculo.md). La tabla de mapeo de abajo queda como historial; las reglas de reescritura y el pipeline siguen vigentes.

## Principle

Ship what exists, restructured into the mastery format; add lessons where the 8-module design has real gaps. Don't claim «25 lecciones» publicly until the count is real.

## Mapping: 10 existing scripts → 8-module design

| Design module | Design lessons | Source | Status |
|---|---|---|---|
| 1 · Fundamentos del sistema fiscal | Cómo funciona el impuesto federal · Formularios que verás siempre · El calendario de la temporada | Lecciones 1, 2, 5 (tipos de impuestos), 6 (1040 family) | Covered; L2's Tío Sam history shrinks to one anecdote |
| 2 · Tu registro como preparador | PTIN y requisitos · Ética y responsabilidad · Firmar como preparador | L1 (responsabilidades), L9 (puntos destacados), live class «Requisitos iniciales» | Partially covered — PTIN/EFIN/e-file provider steps need a new script |
| 3 · Ingresos: W-2, 1099 y efectivo | Leer un W-2 · Los distintos 1099 · Qué ingresos van en el Anexo C · Propinas y efectivo | L5, L8, live classes «W-2», «1099-R» | Covered |
| 4 · Deducciones y créditos | Estándar vs. detallada · EITC · Crédito por hijos | L4, live class «1098 y Anexo A» | Covered |
| 5 · Trabajo independiente: Anexo C | Gastos · Millas y vehículo · Oficina en casa · SE tax | L7 (Anexos), live class «LLC en la 1040 Schedule C» | Thin — needs 2–3 new scripts; this is the flagship practice module |
| 6 · Familia: dependientes y estado civil | Quién es dependiente · Cabeza de familia · Casados | L3, L6 (W-7/ITIN complement) | Covered |
| 7 · Errores comunes y cartas del IRS | Los 10 errores · Cuando llega una carta · Enmendar | L9, live classes «1040X / 9465», «Desempleo y otras formas» | Partially covered — «cartas del IRS» is new |
| 8 · Tu primera temporada | Precios y clientes · Tu sistema de trabajo · (software) | L10 (TaxAct), Bonus «Rumbo al Éxito» | Covered; TaxAct lesson becomes «Tu software» and must be vendor-neutral or updated to whatever Liliana uses in 2027 |

Realistic v1 count: **~20 lessons** from existing material + **~5 new scripts** (PTIN/EFIN, Anexo C gastos, millas, oficina en casa, cartas del IRS). Liliana records new material as text; the avatar produces the video.

## Rewrite rules (every script)

1. Voice: «tú», primera persona, action first. Strip «¡Bienvenidos!» intros/outros, «ustedes», exclamation chains.
2. Split into 5–8 segments of 60–120 s; each segment ends with one question.
3. At least one «esto es lo que pasa de verdad» per lesson — mine the live-class recordings for these.
4. No dollar amounts in the script. Say «la deducción estándar de este año» and tag the segment with `cifra_concept` so the app shows the card.
5. Terms per glossary: Anexo C (Schedule C), ITIN, dependiente, declaración.
6. 10 questions per lesson, 3 options each, feedback per wrong option naming the exact confusion. Seed from the Final Exam docx where possible.

## Production pipeline

`content/lessons/<module>/<lesson>.mdx` (segments as headings, questions in frontmatter YAML) → PR → Liliana reviews in preview → merge → seed script writes DB rows → HeyGen renders each segment (script text → 9:16 MP4, tinta gradient background) → upload to Cloudflare Stream → `segments.stream_video_id` set. Transcript = the script itself.

## Question bank

- Source 1: `Final exam - Questions/Answers.docx`.
- Source 2: most-failed live-class questions (from Liliana).
- Every question tagged with `concept_tag` so the directora panel's «preguntas que más se fallan» is meaningful.

## English track (later)

`(english) Lesson 1` exists (Sept 2025). Once the Spanish v1 is stable: translate the MDX, run through the same pipeline with the English voice clone, `courses.locale = 'en'`. Needs an English voice guide approved by Liliana first.

## Approvals

Scripts, figures, escalated answers, certificate text → Liliana. Figures double-checked against the IRS publication for that year before `cifras.verified_at` is set.
