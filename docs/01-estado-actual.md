# 01 · Estado actual (verificado el 21 sep 2026)

Everything below was checked directly against the systems, not taken from memory.

## Code & hosting

| Item | State |
|---|---|
| GitHub repo | `josemiguelw7/LaAcademia`, **private**. One commit ("Initial commit"). Effectively empty. |
| Vercel | Team `radtak-projects` (Pro) · project `la-academia` (`prj_OJRWJ7hGZqpJFmdydZIz4AaZn5Xc`) linked to the repo. 1 production deployment (READY) from `main`, built from the initial commit. Root URL returns `NOT_FOUND`. |
| Vercel env vars | None. |
| Vercel domains | Only `la-academia-eta.vercel.app`. No custom domain. Deployment protection is on (preview URLs require Vercel login). |
| Supabase | No La Academia project. Existing org `nilxbthnkgjvydnjwijn` hosts Kova, RAI, Cheda, Radtak (Postgres 17). |
| Current live site | `lilianamiranda.com` = WordPress 7.1.1 + Tutor LMS Pro 4.0.9 + WooCommerce (+ WooCommerce Payments) + Elementor + GTranslate. This is what the new platform replaces. |

## Content (Google Drive, root `1qkeOt0NMrMKUO13rrWpTJQxdzRZzP1wy`)

Owner: `academia1lilianamiranda@gmail.com`, shared to Jose Miguel.

**Preparador de Impuestos course — existing assets**

| Asset | Where | Notes |
|---|---|---|
| Maestro scripts, lecciones 1–10 | `Teacher Material/Text Files` | Word docs. Written for live classes: «ustedes», long intros/outros, many «¡…!». Need rewrite into brand voice (tú, primera persona, segments). Figures in them are 2024 (e.g. qualifying-relative income limit $4,700). |
| ITIN complement to lección 6 | same folder | |
| Bonus «Rumbo al Éxito» script | same folder | Business/marketing bonus course |
| «Quién soy y por qué conmigo» | same folder | Liliana's bio — source for landing/about copy |
| «Guía completa para convertirse en preparador» | same folder | Lead-magnet / guide |
| Recorded lesson videos | `La Academia videos - Web Ready` | Intro + Video01–Video09 (~137–390 MB each). Traditional recordings, not avatar. |
| Class folders 00–10 + Bonus + Final Exam | `Classes - Web Ready` | Per-class PPTX + student docx. Class 01 has an **English** version (Lesson 1 pptx + student docx, Sept 2025) — English translation was started. |
| Final exam | `Classes - Web Ready/Final Exam` | `Final exam - Questions.docx` + `Answers.docx` — seed for the question bank |
| Live class recordings 2025 | `Clases grabadas - preparador de impuestos` | Topic videos: W-2, 1098/Anexo A, 1099-R, rental property, LLC on Schedule C, 1040X/9465, unemployment, IRS2Go. Plus `Clases grabadas 2025` (Oct–Nov 2025 sessions). Good source of «esto es lo que pasa de verdad» stories and advanced modules. |
| Diploma/Certificate | `Diploma - Certificate` | Current certificate design |

**Other courses in the same Drive (not in scope for v1):** Curso Empresarial (+ continuación, videos 1–5), Curso QuickBooks, Rumbo al Éxito, Marketing Digital, De la Idea a la Acción, Domina tu Visión, Imperio Digital Academy. The platform should be built so these can become additional courses later (multi-course from day one in the data model, single course in the UI).

## The 10 real lessons

| # | Title (from the Maestro scripts) |
|---|---|
| 1 | Qué es un preparador, un contribuyente, los impuestos y el IRS; responsabilidades de cada uno |
| 2 | El Tío Sam y los impuestos; qué es el impuesto sobre la renta; en qué se usan los impuestos |
| 3 | Estados civiles del contribuyente y dependientes (cabeza de familia, hijo/pariente calificado) |
| 4 | Deducciones y créditos |
| 5 | Tipos de ingresos, tipos de impuestos, quién debe declarar |
| 6 | Formularios 1040, 1040-X, 1095-A, W-7 (+ complemento ITIN) |
| 7 | Anexos (Schedules) |
| 8 | Formularios de ingreso (W-2, 1099s…) |
| 9 | Puntos destacados para un preparador de impuestos |
| 10 | Software TaxAct: instalación, captura, validación, e-file |

Bonus: Rumbo al Éxito (conseguir clientes, negocio propio). Final exam exists.

## Design & brand

- Brand Book v1.0 (sept 2026) and six prototype screens are packaged in the `la-academia` Claude skill (installed) — single source of truth for voice, palette, components and screen behaviour.
- Logos exist only as raster (PNG/JPG). Need vector from the designer before print.

## Gaps found

1. **Tax figures in the prototypes and the brand-book examples are pre-OBBBA.** For TY2026: standard deduction $16,100 / $32,200 / $24,150; 1099-NEC/MISC threshold $2,000; 1099-K back to $20,000 + 200 transactions; business mileage 72.5¢ (mid-year change to 76¢ reported — confirm). All figures must live in the `cifras` table, never in copy.
2. **25-lesson design vs 10 existing scripts** — see `05-contenido.md` for the mapping.
3. Prototype `00 Sistema` labels #8A857D as «gris texto»; the brand book's gris texto is #6F6A63.
4. Pricing ($497 / $897 / $1,497), seat counts, and the English voice are not yet approved by Liliana.
5. No Supabase project, no env vars, no domain on Vercel yet.
