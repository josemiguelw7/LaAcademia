# content/ — guiones y preguntas del curso

Fuente de verdad del contenido. Cada lección es un archivo MDX en `content/lessons/<módulo>/<nn>-<slug>.mdx`. El seed (`scripts/seed-content.ts`, fase 1) lee estos archivos y escribe `lessons`, `segments`, `questions` y `options` en Supabase. Nada se edita en la base directamente.

## Estructura de un archivo de lección

```
---
id: 03-01                      # módulo-lección
module: 3
lesson: 1
slug: estados-civiles
title: Los cinco estados civiles
objective: Elegir el estado civil correcto de cualquier cliente.
duration_min: 9
status: draft | review | approved | recorded
source: [Lección 3 Maestro]
cifras: [deduccion_estandar]   # conceptos que la app muestra en tarjeta
practice: 03-estado-civil      # práctica del módulo que usa esta lección, si aplica
questions:
  - id: q1
    after_segment: 1           # la pregunta aparece al terminar este segmento
    concept_tag: estado-civil-31-dic
    prompt: ...
    options:
      - { id: a, text: ..., correct: false, feedback: "Casi. ..." }
      - { id: b, text: ..., correct: true,  feedback: "Exacto. ..." }
      - { id: c, text: ..., correct: false, feedback: "Casi. ..." }
---

## S1 · Título del segmento
Texto del guion tal como lo dice el avatar. Frases cortas. Tú, primera persona.

<Cifra concept="deduccion_estandar" status="single" />
<!-- La app muestra la tarjeta con el monto del año; el guion dice «la deducción estándar de este año» y nunca el número. -->

> **HISTORIA · Liliana:** [qué le pedimos que cuente, en 30–60 s]

## S2 · ...
```

## Reglas (resumen de la skill `la-academia`)

1. Voz: Liliana en primera persona, «tú». Acción primero, razón después. Máximo 20 palabras por frase. Nada de «¡Bienvenidos!», «ustedes», cadenas de signos de exclamación.
2. Un segmento dura 60–120 s dichos en voz alta (≈150–280 palabras). Cada segmento termina con una pregunta (algunos con dos).
3. Ningún monto en dólares ni porcentaje que cambie por año dentro del guion. Se etiqueta con `<Cifra>` y la app lo muestra. Las tasas fijas por ley (7.5 % del AGI, 50 % de comidas) sí pueden decirse, pero mejor también en tarjeta.
4. 10 preguntas por lección, 3 opciones, una correcta. Cada opción incorrecta lleva retroalimentación que nombra la confusión exacta y empieza con «Casi.». La correcta empieza con «Exacto.» y refuerza la razón. Nunca «Incorrecto» a secas.
5. Las preguntas son de decisión, no de definición: «Marisol se separó en marzo… ¿qué marca?», no «¿qué es cabeza de familia?».
6. `concept_tag` en cada pregunta, para que el panel de la directora («preguntas que más se fallan») tenga sentido.
7. Cada lección tiene al menos un bloque `HISTORIA · Liliana`. Si ella no tiene una para esa lección, se graba sin él, pero el hueco queda marcado.
8. Términos según glosario: Anexo C (Schedule C) en primera mención, luego Anexo C; ITIN explicado en primera mención; «dependiente», no «hijo»; «declaración», no «taxes».
9. Antes de `status: approved`, Liliana revisa el guion y las preguntas, y las cifras se verifican contra la publicación del IRS del año.

## Estados

`draft` → escrito · `review` → enviado a Liliana · `approved` → aprobado por Liliana · `recorded` → video en Cloudflare Stream y `segments.stream_video_id` cargado.
