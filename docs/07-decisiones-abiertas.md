# 07 · Decisiones abiertas

Items that need a human decision before the relevant phase. Owner in brackets.

| # | Decision | Needed by | Owner |
|---|---|---|---|
| 1 | Approve tier prices ($497 / $897 / $1,497) and Mentoría seat count | Phase 1 | Liliana |
| 2 | Final lesson list: which of the ~20 mapped lessons ship in v1, which 5 new scripts get written | Phase 0 | Liliana + JM |
| 3 | Software lesson: keep TaxAct or make it vendor-neutral | Phase 1 | Liliana |
| 4 | Video host: Cloudflare Stream (recommended) vs Mux | Phase 0 | JM |
| 5 | Auth method for phone-first students: email OTP vs SMS OTP (SMS costs) | Phase 0 | JM |
| 6 | WhatsApp number: new business number for La Academia vs Liliana's own | Phase 0 (verification lead time) | Liliana |
| 7 | Migration of existing students: free upgrade to the new platform (recommended) or re-purchase | Phase 3 | Liliana |
| 8 | Domain cutover date and how long WordPress stays on `legacy.` | Phase 3 | JM |
| 9 | English voice guide (brand book only defines Spanish) | Phase 5 | Liliana |
| 10 | Vector logo files from the original designer | before any print | Liliana |
| 11 | Business mileage 2026: confirm on irs.gov whether the mid-year 76¢ rate is real before seeding | Phase 0 | JM |
| 12 | Refund policy and terms (one-time payment, lifetime access) | Phase 1 | Liliana |

## Decisions already made

- Own stack (Next.js + Supabase on Vercel), not Tutor LMS / SaaS LMS.
- Brand: Ónix y Bronce, Playfair Display + Manrope, Brand Book v1.0 is the source of truth (packaged as the `la-academia` skill).
- Mastery rule 8/10; lessons unlock sequentially; module practices optional.
- All tax figures in a central `cifras` table keyed by tax year; never in video.
- Bot and Liliana are always distinguishable; bot never uses her photo.
- HeyGen for avatar production only; runtime independent of it.
