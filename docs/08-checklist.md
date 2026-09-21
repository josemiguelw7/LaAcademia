# 08 · Checklist de construcción

Working checklist for the build. Tick items here (edit the file, commit) — this is the progress tracker until we move to Issues. Owner: **JM** = Jose Miguel, **LM** = Liliana, **C** = Claude (with JM). Dates from `06-roadmap.md`.

Legend: `[ ]` todo · `[x]` done · `[~]` in progress · `[!]` blocked

---

## Phase 0 · Foundation — target 5 Oct 2026

### 0.1 Decisions to unblock (LM + JM)
- [ ] LM approves lesson list for v1 (which ~20 mapped lessons + 5 new scripts) — `05-contenido.md`
- [ ] LM approves prices $497 / $897 / $1,497 and Mentoría seat count
- [ ] LM decides WhatsApp number (new business number recommended) — start Meta Business verification now
- [ ] LM: TaxAct lesson stays or goes vendor-neutral
- [ ] JM confirms video host (Cloudflare Stream) and auth method (email OTP)
- [ ] JM confirms 2026 mileage rate (72.5¢; verify reported mid-year 76¢) before seeding cifras
- [ ] LM requests vector logo files from the designer

### 0.2 Accounts & infra (JM)
- [ ] Create Supabase project `la-academia` (us-east-1); note project ref, anon + service keys
- [ ] Create Cloudflare Stream enablement + signing key
- [ ] Create Stripe account (or connected account) for La Academia; product + 3 prices; webhook secret
- [ ] Resend: verify `lilianamiranda.com`; senders `liliana@` and `hola@`
- [ ] Meta Business Manager: apply for WhatsApp Business account + number
- [ ] Anthropic API key for the assistant
- [ ] Add all env vars to Vercel (production + preview)
- [ ] Set repo back to private; add branch protection on `main`

### 0.3 Repo scaffold (C)
- [ ] `create-next-app` (Next.js 15, TS, App Router, Tailwind v4, ESLint) at repo root
- [ ] Brand tokens in `app/globals.css` (`@theme` from skill `tokens.css`); fonts Playfair Display + Manrope
- [ ] Route groups `(marketing)`, `(alumno)`, `(directora)`, `api/`
- [ ] Supabase clients (server, browser, service) + typed DB (`supabase gen types`)
- [ ] Auth middleware: protect `(alumno)` and `(directora)`; role check
- [ ] `CLAUDE.md` updated with commands; `.env.example`
- [ ] First deploy green on Vercel; preview deployments working

### 0.4 Database (C)
- [ ] Migration 001: profiles, plans, purchases, cohorts, cohort_members
- [ ] Migration 002: courses, modules, lessons, segments, questions, options
- [ ] Migration 003: practices, practice_cases, practice_boxes
- [ ] Migration 004: lesson_progress, attempts, attempt_answers, practice_attempts, streaks, certificates
- [ ] Migration 005: cifras, settings
- [ ] Migration 006: conversations, messages, escalations, events
- [ ] RLS policies per role (alumno / directora / admin / anon) + tests
- [ ] Views: v_students, v_failed_questions_30d, v_inbox
- [ ] Seed: plans, cifras TY2025 + TY2026 (unverified flag), course skeleton (8 modules, lessons from 05)
- [ ] Function `unlock_next_lesson()` + trigger on mastered attempt

### 0.5 Brand component kit (C)
- [ ] Button (primario / secundario / liliana / disabled) with focus ring
- [ ] Card + Card énfasis (tinta)
- [ ] Input + label + error state
- [ ] QuizOption (unselected / selected / correct / wrong)
- [ ] LessonNode (bloqueada / disponible / en progreso / dominada)
- [ ] ProgressBar (segmented + continuous) and ProgressRing
- [ ] BottomNav (Curso · Práctica · Progreso · Ayuda) + floating Mic
- [ ] EmptyState, Label (uppercase tracked), CifraCard
- [ ] `/kit` preview page to review on a phone with LM

---

## Phase 1 · Core loop — target 2 Nov 2026

### 1.1 Marketing & purchase
- [ ] Landing (screen 06): hero, promesa, tres niveles, «quién soy» from Drive doc, FAQ
- [ ] Stripe Checkout per plan; success/cancel pages
- [ ] Webhook `checkout.session.completed` → purchases + profile create/link → welcome email (from Liliana)
- [ ] Mentoría seat counter from `cohorts.seats` (real numbers only)
- [ ] Legal: términos, privacidad, reembolsos (LM approves)

### 1.2 Auth & onboarding
- [ ] Email OTP sign-in; Google optional
- [ ] Onboarding: nombre, ciudad, teléfono/WhatsApp opt-in
- [ ] Role assignment; directora account for LM

### 1.3 Course tree (screen 02)
- [ ] Serpentine mobile layout; desktop sidebar with module list + «Vas en» card
- [ ] Header: racha, %, «x de N dominadas» (N from DB, not hardcoded)
- [ ] States driven by `lesson_progress`

### 1.4 Lesson player (screen 01)
- [ ] Cloudflare Stream player, 9:16, signed tokens (short TTL)
- [ ] Segment sequencing: play → question → feedback → next
- [ ] States: Hablando / Esperando tu respuesta / Liliana explica
- [ ] Attempt lifecycle: start, answer (server-validated), finish → score → dominada at ≥ 8/10
- [ ] Feedback shows chosen ✕ and correct ✓ with per-option feedback
- [ ] Transcript panel
- [ ] «Cifras de este año» panel reading `cifras` for `settings.active_tax_year`
- [ ] Desktop two-column layout
- [ ] Retry flow (unlimited)

### 1.5 Dashboard / Progreso (screen 04)
- [ ] «Sigue aquí» next-lesson card; empty state for new student
- [ ] Avance %, dominadas, racha, certificate progress card
- [ ] «Preguntarle a Liliana» (WhatsApp deep link) gated by plan
- [ ] Últimas dominadas list

### 1.6 Content (LM + C) — parallel
- [ ] Rewrite lessons 1–10 to brand voice, segmented, no figures in text → `content/lessons/*.mdx`
- [ ] 10 questions per lesson with feedback per wrong option (seed from Final Exam docx)
- [ ] LM reviews modules 1–3 on preview
- [ ] HeyGen: render module 1–3 segments (9:16, tinta gradient bg) → upload to Stream → set `stream_video_id`
- [ ] Seed script `pnpm content:seed` (MDX/YAML → DB, idempotent)

---

## Phase 2 · Práctica, certificado, panel — target 23 Nov 2026

### 2.1 Práctica Anexo C (screen 03)
- [ ] Schedule C replica component (official English labels, 4 px radius, tinta grid)
- [ ] Case 4 · Rosa Delgado documents (1099-K, mileage log, W-2, supplies, phone)
- [ ] Grading: expected values from `expected_expr` evaluated against `cifras` for case year
- [ ] Per-box ✓/✕, explanatory notes, «Revisar de nuevo», «Pista», calculated lines greyed
- [ ] Practice unlock when module complete; result stored in `practice_attempts`

### 2.2 Certificate
- [ ] PDF (landscape letter, double rule, brand text) + 4:5 share image
- [ ] Number `LA-AAAA-NNNNN`; issued when all lessons dominadas
- [ ] Public `/verificar/[number]`
- [ ] Email from Liliana with PDF

### 2.3 Directora panel (screen 05)
- [ ] Alumnos list: plan, %, última actividad, inactivos 7d; filters
- [ ] Student detail: attempts, questions, escalations
- [ ] Preguntas que más se fallan (30 días)
- [ ] Cifras editor with source URL + «verificado» toggle (only verified rows show to students)
- [ ] Contenido: publish/unpublish lessons
- [ ] Ventas summary (from purchases)

### 2.4 Emails (Resend)
- [ ] Compra confirmada (Liliana)
- [ ] Módulo dominado (Liliana)
- [ ] Certificado emitido (Liliana)
- [ ] Pago fallido / recordatorio (sistema, `hola@`)
- [ ] Inactivo 7 días nudge (Liliana, plan-aware)

### 2.5 Content
- [ ] New scripts written by LM: PTIN/EFIN, Anexo C gastos, millas y vehículo, oficina en casa, cartas del IRS
- [ ] HeyGen renders modules 4–8
- [ ] Full course seeded and playable end-to-end

---

## Phase 3 · WhatsApp + migration + launch — target 14 Dec 2026

### 3.1 WhatsApp assistant
- [ ] Cloud API webhook (verify + inbound); match student by phone
- [ ] Assistant persona («Asistente de Liliana», monogram avatar) grounded on lesson transcripts (embeddings over `segments.transcript`)
- [ ] Guardrails: answers only course content; individual tax advice → escalate
- [ ] Escalations → directora inbox; Liliana reply → outbound prefixed «Soy Liliana.»
- [ ] Plan gating: season vs year vs none (Curso plan gets bot only)
- [ ] Message templates approved by Meta (welcome, escalation answered)

### 3.2 Migration from WordPress
- [ ] Export WooCommerce orders + Tutor enrollments (CSV)
- [ ] Import → profiles + purchases (plan `curso`), invite emails
- [ ] Old course URLs → redirects
- [ ] `lilianamiranda.com` DNS → Vercel; WordPress → `legacy.lilianamiranda.com` (90 days)
- [ ] Cancel unused WP plugins/licences after cutover

### 3.3 QA & launch
- [ ] Real-device pass (iPhone SE, mid Android) in sunlight, one hand
- [ ] Contrast audit vs brand table; keyboard/focus
- [ ] Stripe test → live; refund flow tested
- [ ] Load test video playback with signed tokens
- [ ] Brand checklist (skill) on every screen and email
- [ ] Soft launch: Level 1 + 2 purchasable; Mentoría cohort «Enero 2027» open
- [ ] Announce to existing students (email from Liliana)

---

## Phase 4 · Season (Jan–Apr 2027)
- [ ] Weekly: review `v_failed_questions_30d`, fix questions/scripts
- [ ] Group session logistics (calendar + link)
- [ ] Cifras mid-year updates
- [ ] Support rota for escalations (response < 24 h in season)

## Phase 5 · After season
- [ ] Voice tutor (mic): STT → Claude → ElevenLabs voice clone
- [ ] English track (needs LM-approved English voice guide)
- [ ] Second course (Empresarial) on the same engine
- [ ] PWA install prompt; evaluate Capacitor

---

## Progress log
| Date | Update |
|---|---|
| 2026-09-21 | Plan written and pushed. Repo empty otherwise. |
