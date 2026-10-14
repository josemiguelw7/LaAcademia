# 04 · Modelo de datos (Supabase / Postgres)

Multi-course from day one; v1 UI shows one course. All content is versioned by `published_at`; students only see published rows.

## Identity & commerce

```sql
profiles        (id uuid pk = auth.users.id, full_name, phone_e164, whatsapp_opt_in bool,
                 role text check in ('alumno','directora','admin'), city, locale 'es'|'en', created_at)
plans           (id text pk 'curso'|'soporte'|'mentoria', name, price_cents, stripe_price_id,
                 whatsapp_access 'none'|'season'|'year', group_sessions, calls_per_month, return_reviews, seats int null)
purchases       (id, user_id, course_id, plan_id, stripe_session_id, stripe_customer_id, amount_cents,
                 status 'paid'|'refunded', purchased_at)
cohorts         (id, plan_id 'mentoria', name 'Octubre 2026', seats 12, starts_at)     -- real seat counts
cohort_members  (cohort_id, user_id)
```

## Course content

```sql
courses         (id, slug 'preparador-de-impuestos', title, locale, published_at)
modules         (id, course_id, position, title, description)
lessons         (id, module_id, position, slug, title, duration_sec, mastery_threshold int default 8,
                 questions_per_attempt int default 10, published_at)
segments        (id, lesson_id, position, title, stream_video_id, duration_sec, transcript text)
questions       (id, lesson_id, segment_id null, position, prompt, explanation_correct,
                 concept_tag, cifra_concept null)                     -- cifra_concept links a question to a figure
options         (id, question_id, letter 'A'|'B'|'C', text, is_correct, feedback)   -- feedback per wrong option
practices       (id, module_id, kind 'quiz'|'form', title, form_type 'schedule_c'|'1040'|null, tax_year)
practice_cases  (id, practice_id, title 'Caso 4 · Rosa Delgado', narrative, documents jsonb)
practice_boxes  (id, case_id, line_no '25', label, expected_expr text, kind 'input'|'calc', note_on_error)
```

`expected_expr` is evaluated against `cifras` at grade time (e.g. `9120 * cifra('mileage_business', case.tax_year)`) so answer keys never go stale.

## Learning state

```sql
lesson_progress (user_id, lesson_id, status 'bloqueada'|'disponible'|'en_progreso'|'dominada',
                 best_score, last_score, attempts int, mastered_at, pk(user_id, lesson_id))
attempts        (id, user_id, lesson_id, started_at, finished_at, score, passed bool)
attempt_answers (attempt_id, question_id, option_id, is_correct, answered_at)
practice_attempts (id, user_id, case_id, submitted jsonb, correct_boxes int, total_boxes int, finished_at)
streaks         (user_id pk, current_days, longest_days, last_active_date)
certificates    (id, user_id, course_id, number 'LA-2027-00001', issued_at, pdf_path, share_image_path)
```

Unlock rule (server-side): lesson n becomes `disponible` when lesson n-1 is `dominada`; module practice becomes available when every lesson in the module is `dominada`.

## Cifras (single source of tax figures)

```sql
cifras          (id, tax_year int, concept text, filing_status text null, value numeric, unit 'usd'|'pct'|'usd_per_mile',
                 label_es, label_en, source_url, effective_from date null,        -- mid-year changes (mileage)
                 verified_by uuid, verified_at, notes)
settings        (key pk, value jsonb)  -- e.g. active_tax_year = 2026, season_open = true
```

Seed TY2025 and TY2026 from `references/cifras.md` in the skill; Liliana verifies each row in the panel before it becomes visible.

## Messaging (WhatsApp)

```sql
conversations   (id, user_id, wa_phone, last_message_at)
messages        (id, conversation_id, direction 'in'|'out', author 'alumno'|'asistente'|'liliana',
                 body, lesson_ref null, wa_message_id, created_at)
escalations     (id, conversation_id, message_id, question_text, lesson_ref, status 'abierta'|'respondida',
                 answered_by, answered_at)
```

`author` drives rendering everywhere — the brand requires students to always know whether the bot or Liliana is speaking.

## Events

```sql
events          (id, user_id, name, props jsonb, created_at)   -- video_started, segment_completed, mic_used, whatsapp_opened…
```

## Views for the directora panel

- `v_students`: profile + plan + % mastered + last activity + inactive_7d flag.
- `v_failed_questions_30d`: question, lesson, fail rate over last 30 days (from `attempt_answers`).
- `v_inbox`: open escalations with student, plan, lesson ref, age.

## Plataforma del graduado (migración 20261013000009)

Decidido con Liliana el 13 oct 2026. Mínimo privilegio: el graduado ve lo suyo; la directora solo casos mandados a revisión; el admin no ve datos de clientes.

```sql
subscriptions   (user_id, plan_id, stripe_subscription_id, status, current_period_end)   -- nivel alto anual
seasons         (tax_year pk, opens_on, closes_on, purge_on)                              -- 2026: nov 2026 → oct 2027
firms           (owner_id unique, business_name, logo_path, ptin_last4, efin_status, stripe_account_id, agreement_*)
clients         (firm_id, full_name, email, phone_e164, ssn_enc, ssn_last4, dob_enc)       -- *_enc cifrado por la app
cases           (firm_id, client_id, tax_year, status, questionnaire, score, score_reasons, review_mode, random_audit)
case_documents  (case_id, kind, status esperado|recibido|no_aplica, storage_path, mime, size ≤ 4 MB, sha256, key_version,
                 extracted, extracted_secure_enc)
return_reviews  (case_id, version, pdf_path, sha256, key_version, submitted_by, decision aprobada|devuelta, decided_by, notes)
review_packs    (firm_id, tax_year, reviews 10)        violations (firm_id, case_id, tax_year, kind)
consents        (case_id, kind 7216_divulgar|7216_usar, text_version, signer_name, signed_at, ip)
intake_links    (case_id, token_hash, expires_at)      -- sin políticas: solo servidor
access_log      (actor, case_id, object_kind, action, at)  -- solo agregar
firm_review_quota (vista: allowed = 15 + paquetes, used = casos distintos revisados, strikes)
```

Reglas en la base: el graduado no puede poner estados de revisión ni puntaje; «enviada» solo desde «aprobada»; cupo y suspensión (2 faltas) al mandar a revisión; la directora solo cambia campos de decisión y una sola vez. Depósitos `documentos` y `declaraciones`: privados, sin políticas, contenido cifrado con `lib/crypto.ts` (AES-256-GCM, llaves `DATA_KEYS` / `DATA_KEY_CURRENT` fuera de la base).

Pruebas: `supabase/tests/graduate_platform_rls.sql` (18 casos) sobre `00_supabase_shim.sql` en un Postgres local.
