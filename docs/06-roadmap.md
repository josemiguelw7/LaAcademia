# 06 · Roadmap

Anchor: **tax season 2027 (Jan–Apr)**. Level 2 «soporte de temporada» must work from the first week of January. Today is 21 Sep 2026 → ~13 weeks to a mid-December soft launch.

Two tracks run in parallel: **Build** (Jose Miguel) and **Content** (Liliana + rewrite help). The launch date is gated by content more than by code.

## Phase 0 · Foundation — weeks 1–2 (until 5 Oct)

- [ ] Create Supabase project `la-academia` (us-east-1); enable Auth (email OTP + Google), Storage.
- [ ] Scaffold Next.js 15 + TS + Tailwind v4 in the repo; brand tokens from the skill; `CLAUDE.md`.
- [ ] Vercel env vars, PR previews, Supabase branching.
- [ ] Migrations for identity, course content, learning state, cifras (docs/04).
- [ ] Seed cifras TY2025 + TY2026; seed course skeleton (modules/lessons from docs/05).
- [ ] Brand component kit: Button (primario/secundario/liliana), Card, Input, QuizOption, LessonNode, ProgressBar, BottomNav, EmptyState.
- Content: freeze the lesson list with Liliana; agree on the 5 new scripts; confirm prices and tier features.

## Phase 1 · Core loop — weeks 3–6 (until 2 Nov)

- [ ] Landing + pricing (screen 06) with Stripe Checkout; purchase webhook; welcome email.
- [ ] Auth + onboarding (name, phone, WhatsApp opt-in).
- [ ] Course tree (screen 02) driven by `lesson_progress`.
- [ ] Lesson player (screen 01): Stream playback, segment → question → feedback states, mastery calc, unlock.
- [ ] Cifras panel in the player.
- [ ] Dashboard/Progreso (screen 04) incl. empty state and streak.
- Content: rewrite lessons 1–10 into MDX (voice + segments + questions); Liliana approves in previews; HeyGen renders module 1–3.

## Phase 2 · Práctica, certificado, panel — weeks 7–9 (until 23 Nov)

- [ ] Anexo C practice (screen 03) with case 4 (Rosa Delgado); grading from `cifras`; notes per box.
- [ ] Certificate PDF + share image + `/verificar/[number]`.
- [ ] Directora panel (screen 05): students, history, failed questions, cifras editor with verify flag.
- [ ] Emails: purchase, module dominado (from Liliana), certificate, payment failed (system).
- Content: HeyGen renders modules 4–8; new scripts written and approved.

## Phase 3 · WhatsApp + migration — weeks 10–12 (until 14 Dec)

- [ ] WhatsApp Cloud API number + verified business; inbound webhook; assistant persona grounded in transcripts; escalation inbox; Liliana replies from panel.
- [ ] Import existing students: export WooCommerce orders + Tutor enrollments → `profiles` + `purchases` (plan `curso`); invite emails.
- [ ] Domain cutover: `lilianamiranda.com` → Vercel; WordPress to `legacy.lilianamiranda.com` for 90 days; redirects for the old course URLs.
- [ ] Load/QA on real phones; accessibility check against the contrast table.
- **Soft launch ~15 Dec**: Level 1 + Level 2 purchasable; first cohort of Mentoría opens for January.

## Phase 4 · Season support — Jan–Apr 2027

- Weekly group session tooling (link + calendar, no custom video).
- Watch `v_failed_questions_30d`; fix scripts/questions weekly.
- Cifras mid-season updates (mileage etc.).

## Phase 5 · After season (May 2027+)

- Voice tutor (mic) with ElevenLabs voice clone.
- English track.
- Second course (Curso Empresarial) using the same engine.
- PWA install prompt; Capacitor wrap only if store presence matters.

## Milestones

| Date | Milestone |
|---|---|
| 5 Oct | Repo scaffolded, DB migrated, brand kit rendered on preview |
| 2 Nov | A student can buy, watch module 1, master a lesson, see the tree |
| 23 Nov | Full course playable end-to-end with real avatar video; certificate issues |
| 14 Dec | WhatsApp assistant live; existing students migrated; domain on Vercel |
| Early Jan 2027 | Season opens; Level 2 support active |

## Risks

| Risk | Mitigation |
|---|---|
| Avatar/video production is the long pole | Start HeyGen renders with module 1 in week 3; batch weekly. |
| Liliana's review bandwidth during Q4 | PR previews on the phone; one module per week; scripts before videos. |
| Tax figure changes mid-season | `cifras.effective_from`; never in video. |
| Paid video leakage | Cloudflare Stream signed tokens, short TTL. |
| WhatsApp business verification delays | Apply in Phase 0, not Phase 3. |
| Client PII in Mentoría return reviews | Secure upload to private bucket, retention policy, consent text; framed as teaching review. |
