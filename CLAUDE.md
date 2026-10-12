# LaAcademia

Liliana Miranda · La Academia — avatar-led tax-preparer course. Next.js 15 + Supabase on Vercel (project `la-academia`, team `radtak-projects`).

- Read `docs/README.md` first; the plan lives in `docs/`.
- Brand, voice, UI components and tax-figure rules: use the `la-academia` skill for every screen, string, email or message. Run its checklist before shipping.
- Tax figures never go in code, copy or video — they live in the `cifras` table (see docs/04).
- Spanish UI, «tú», Liliana in first person. Bot and Liliana must always be distinguishable.

## Commands
- `npm run dev` / `npm run build` — Next.js 15 app (App Router, Tailwind v4 with brand tokens in `app/globals.css`).
- `python3 scripts/validate-lessons.py` — validate every lesson MDX before committing.
- `python3 scripts/build-content-seed.py` — regenerate `supabase/seed/content.sql` from `content/`.
- DB: migrations in `supabase/migrations/`; seeds in `supabase/seed/` (cifras rows stay unverified until Liliana verifies them).
- `/revision` — Liliana's script-review view (noindex), statically generated from `content/lessons`.
