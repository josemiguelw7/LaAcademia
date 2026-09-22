# 10 · Retroalimentación de Liliana (22 sept 2026) y qué hicimos con ella

Sobre los PDFs «Diagnóstico y plan» y «Lección piloto 3.1» del 21 de septiembre.

| # | Lo que dijo | Estado | Dónde |
|---|---|---|---|
| 1 | **«20 años en el IRS» es incorrecto.** Son más de 20 años preparando impuestos, más experiencia dentro del IRS como Tax Examiner. | **Corregido** en la skill (v1.1), docs, guion y PDFs. Línea estándar: «Más de 20 años preparando impuestos, con experiencia dentro del IRS como Tax Examiner». El error venía del Brand Book v1.0; hay que corregirlo también en la landing, certificado, lower-thirds y firma de email. | skill `SKILL.md`, `voice.md`, `visual-system.md`, `product-spec.md` |
| 2 | Misma metodología en todas las lecciones: qué resuelves → regla → qué preguntas → qué evidencia → caso → decisión → por qué las otras están mal → dónde va en la 1040/software → qué guardas → checklist. | **Adoptado** como plantilla obligatoria. | `content/README.md` |
| 3 | Un cliente ficticio que acompañe todo el curso. | **Adoptado**: María Ortega. | `content/casos/maria.md` |
| 4 | Demos de software cortas por lección, separadas del video principal. | **Adoptado**; pendiente la decisión TaxAct/neutral para grabarlas. | `content/README.md`, campo `demos:` |
| 5 | Documentación desde el principio: «¿cómo pruebo lo que el cliente me dijo?». | **Adoptado** como paso 4 y 9 de la plantilla; aplicado en 3.1 (S4, S5, S7 y checklist). | `content/README.md`, 3.1 |
| 6 | Tarjetas de cifras con año fiscal, fuente del IRS y fecha de verificación. | Ya estaba en el modelo (`cifras.tax_year`, `source_url`, `verified_at`); ahora es regla explícita de UI. | `04-modelo-de-datos.md`, `content/README.md` |
| 7 | Tono: «el preparador no adivina cuál conviene: verifica cuál corresponde y compara». Quitar «casi siempre conjunta sale mejor», «por separado lo protege», «el que menos conviene». | **Adoptado** como regla 5b; 3.1 reescrita (S1, S3, S7, Q3, Q4, Q9). | `content/README.md`, 3.1 |
| 8 | MFS: nombrar las excepciones (EITC y cuidado de hijos si «considerada no casada»; educación no). Comunidad de bienes en Texas (8958). | **Corregido** en 3.1 S3 y en la retroalimentación de Q3/Q4. | 3.1 |
| 9 | Historias de Liliana opcionales, no una por lección. | **Adoptado**. | `content/README.md`, `09-curriculo.md` §1.5, skill `voice.md` |
| 10 | No aprobar 3.1 para producción sin auditoría tributaria línea por línea del piloto y del currículo. | **Aceptado**: 3.1 queda en `status: review`; ninguna lección pasa a `approved` sin su revisión. | 3.1 |
| 11 | Ella propone su propia versión de los 8 módulos y 30 lecciones. | **Esperando su propuesta**; `09-curriculo.md` no se reestructura hasta que llegue. Se fusionan las dos. | — |

Pendiente de ella: la propuesta de estructura (11), la decisión TaxAct/neutral (4), y la lectura de 3.1 v2.
