# 02 · Visión y alcance

## What we are building

An own-stack LMS for **Liliana Miranda · La Academia**: an avatar-led, mobile-first course that trains Spanish-speaking adults in the US to become tax preparers, with graded access to Liliana herself. It replaces the WordPress + Tutor LMS + WooCommerce site at `lilianamiranda.com`.

Brand promise: **«Acceso directo a mí, en tu idioma.»** Every feature either brings the student closer to Liliana or speaks their language; otherwise it doesn't ship.

## Who it's for

Spanish-speaking adults in the US wanting a serious second income — mothers, gig drivers (Uber/DoorDash/Instacart) — studying on a phone in spare moments. Design constraints: one hand, sunlight, interruptions, 12-minute sessions.

## Core loop (from the prototypes)

1. **Lesson player**: vertical avatar video split into ~7 segments; a multiple-choice question after each segment; avatar «waits» while the student answers; feedback names the exact confusion; optional mic to ask the voice tutor.
2. **Mastery, not completion**: a lesson is *dominada* with ≥ 8/10 correct; that unlocks the next. Unlimited retries.
3. **Practice**: each module ends with an optional practice; the flagship one is an interactive **Anexo C** replica filled box by box from a fictional client's documents, validated per box.
4. **Cifras del año**: all tax amounts come from one editable table (by tax year); videos talk concepts.
5. **Progress**: course tree, streak, % mastered, certificate at 100 %.
6. **Access to Liliana**: WhatsApp assistant (bot answers what's in the course, escalates the rest to Liliana's inbox), group sessions, 1:1 calls — gated by tier.
7. **Directora panel** for Liliana: students, attempts, most-failed questions, escalation inbox, cifras editor.

## Tiers (proposal — Liliana to approve)

Same course in all tiers; what rises is access to Liliana. One-time payment, lifetime course access.

| | Curso | Curso + soporte de temporada | Mentoría |
|---|---|---|---|
| Proposed price | $497 | $897 | $1,497 (groups of 12) |
| Lessons, practices, voice tutor, cifras, certificate | ✓ | ✓ | ✓ |
| WhatsApp directo con Liliana | — | Ene–Abr | Todo el año |
| Sesión grupal en vivo | — | weekly in season | weekly all year |
| Llamada 1 a 1 al mes | — | — | ✓ |
| Revisión de tus primeras 3 declaraciones | — | — | ✓ |

## In scope for v1 (launch for the 2027 season)

- Spanish track of the Preparador de Impuestos course, lessons produced with the avatar.
- Purchase (Stripe), auth, player, quiz, mastery, course tree, dashboard, certificate.
- Cifras table + panel, at least one Anexo C practice case.
- WhatsApp assistant with escalation inbox.
- Directora panel (students, failures, inbox, cifras).
- Migration of existing WooCommerce/Tutor students.

## Explicitly later

- Voice tutor (mic) — depends on ElevenLabs voice clone quality and cost; ship after core loop is stable.
- English track — brand voice in English isn't defined yet.
- Other courses (Empresarial, QuickBooks, Rumbo al Éxito as a bonus) — data model supports them; UI shows one course.
- Native app — the web app is mobile-first and installable (PWA); Capacitor wrap only if store presence is needed.

## Non-negotiables (from the brand book)

Liliana speaks in first person and «tú». No income promises, no «fácil/garantizado», no IRS fear. Every figure has a year. Liliana and her assistant are always distinguishable. The brand never gives individual tax advice; Mentoría return reviews are teaching reviews, not preparation or signing.
