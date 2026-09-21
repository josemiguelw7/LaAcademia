# 03 · Arquitectura técnica

## Decision

Reuse the stack already running Kova and RAI so one person can maintain all three: **Next.js on Vercel + Supabase**. No LMS SaaS, no WordPress.

| Layer | Choice | Why |
|---|---|---|
| App | **Next.js 15 (App Router) + TypeScript + Tailwind v4** | Already the house stack; Vercel project exists. Brand tokens from the `la-academia` skill go into `@theme`. |
| UI | shadcn/ui primitives restyled with the Ónix y Bronce tokens; Lucide icons | Matches the brand book's icon spec. |
| Auth + DB + storage | **Supabase** (Postgres 17, Auth, Storage, RLS) — new project `la-academia`, region `us-east-1` (closest to Austin among his existing regions) | Same patterns as Kova (RLS per role). Magic link + Google sign-in; students are phone-first, so keep OTP by email/SMS simple. |
| Video | **Cloudflare Stream** (signed playback tokens) | Cloudflare account already connected; per-minute pricing, no egress surprises, HLS for vertical 9:16, signed URLs so paid content isn't shareable. Fallback: Mux. |
| Avatar production | HeyGen (avatar + voice) → MP4 → Cloudflare Stream | Decided earlier. Keep HeyGen only as a production tool; nothing at runtime depends on it. |
| Payments | **Stripe** Checkout (one-time) + Customer Portal; webhooks → `purchases` | Replaces WooCommerce Payments. Three prices, one product. |
| Email | **Resend** (already connected) with two senders: `liliana@` personal, `hola@` system | Templates follow the brand's email spec. |
| WhatsApp | Meta WhatsApp Cloud API (Business account for La Academia) + Claude API for the assistant | Bot = «Asistente de Liliana»; escalations land in the directora inbox; Liliana replies from the panel or her phone. |
| Voice tutor (later) | ElevenLabs (connected) for Liliana's voice; Claude for answers grounded in lesson transcripts; browser mic → Whisper/ElevenLabs STT | Ship after core. |
| Certificates | Server-rendered PDF (React-PDF or Playwright) stored in Supabase Storage; public verify page `/verificar/LA-2027-00001` | Brand certificate spec. |
| Analytics | Vercel Analytics + a `events` table for learning analytics (attempts are the real analytics) | |
| Domain | `lilianamiranda.com` → Vercel; keep WordPress on a subdomain (`legacy.`) during migration | |

## Repo layout

```
LaAcademia/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # landing, precios, verificar
│   ├── (alumno)/           # curso, practica, progreso, ayuda  (bottom nav)
│   ├── (directora)/        # panel de Liliana
│   └── api/                # stripe, whatsapp, stream webhooks
├── components/             # brand components (Button, Card, QuizOption, LessonNode…)
├── lib/                    # supabase clients, cifras, mastery logic
├── supabase/
│   ├── migrations/
│   └── seed/               # cifras 2025/2026, course structure, practice case 4
├── content/                # lesson scripts (MDX) + question bank (YAML) — source of truth, seeded into DB
├── docs/                   # this plan
└── CLAUDE.md               # points to the la-academia skill
```

Content lives in the repo as MDX/YAML and is seeded into Postgres, so scripts are versioned, reviewable by Liliana via PR previews, and the DB stays the runtime source.

## Roles & access (RLS)

| Role | Can |
|---|---|
| `alumno` | read published course content for courses they purchased; write own attempts/progress; read own messages |
| `directora` (Liliana) | everything: students, attempts, inbox, cifras editor, publish content |
| `admin` (Jose Miguel) | same as directora + billing/system |
| anonymous | landing, pricing, certificate verification |

Tier gating applies to *access-to-Liliana* features (WhatsApp escalation, sessions, calls), never to course content.

## Key flows

- **Purchase**: Stripe Checkout → webhook → `purchases` row → Supabase user created/linked by email → welcome email from `liliana@`.
- **Lesson**: `GET /curso/[lessonSlug]` → segments + questions; client plays segment n, shows question n; `POST attempt-answer`; on last question compute score → `lesson_progress.status = dominada` if ≥ 8/10 → unlock next.
- **Cifras**: `cifras(tax_year, concept, filing_status, value, source, verified_by, verified_at)`; UI reads the season's active `tax_year` from `settings`.
- **WhatsApp**: inbound message → match student by phone → Claude answers only from lesson transcripts (retrieval over `segments.transcript`) with the assistant persona → if confidence low or out of scope → `escalations` row (status abierta) → Liliana replies → outbound message prefixed «Soy Liliana.».

## Environments

`main` → production (`lilianamiranda.com`); PR previews on Vercel; Supabase branching for schema changes. Secrets in Vercel env (none exist yet): `SUPABASE_*`, `STRIPE_*`, `CLOUDFLARE_STREAM_*`, `RESEND_API_KEY`, `WHATSAPP_*`, `ANTHROPIC_API_KEY`.
