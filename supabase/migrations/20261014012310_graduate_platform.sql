-- Plataforma del graduado (nivel alto): firmas, clientes, casos, documentos, revisión de Liliana.
-- Decisiones aprobadas por Liliana el 13 oct 2026 (ver «La Academia — Plan de construcción»).
--
-- Principios:
--  * Mínimo privilegio: el graduado ve solo lo suyo; la directora solo lo que se mandó a revisión;
--    el admin NO ve datos de clientes (soporte usa el service role, con registro).
--  * Campos sensibles (SSN, fecha de nacimiento, datos extraídos sensibles) llegan cifrados por la
--    aplicación (AES-256-GCM, llave fuera de la base). Aquí solo se guarda el texto cifrado.
--  * Archivos: depósitos privados sin políticas → solo el servidor (service role) lee y escribe,
--    después de comprobar permisos y dejar registro en access_log.

-- ───────────────────────── Helpers de rol ─────────────────────────
create or replace function private.is_directora() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'directora');
$$;
revoke execute on function private.is_directora() from public;
grant execute on function private.is_directora() to anon, authenticated;

-- ───────────────────────── Planes (valores aprobados) ─────────────────────────
alter table public.plans add column if not exists billing text not null default 'one_time'
  check (billing in ('one_time','annual'));
alter table public.plans add column if not exists has_platform boolean not null default false;
-- meses de asistente desde la compra; null = mientras la suscripción esté activa; 0 = sin asistente
alter table public.plans add column if not exists assistant_months integer;

update public.plans set assistant_months = 0 where id = 'curso';
update public.plans set assistant_months = 12 where id = 'soporte';
update public.plans set billing = 'annual', has_platform = true, assistant_months = null,
                        return_reviews = 15, seats = 30
 where id = 'mentoria';

-- ───────────────────────── Suscripciones (Stripe) ─────────────────────────
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_id text not null references public.plans(id),
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null check (status in ('active','past_due','canceled','incomplete')),
  current_period_end timestamptz not null,
  created_at timestamptz not null default now()
);
create index on public.subscriptions (user_id);

-- ───────────────────────── Temporadas ─────────────────────────
create table public.seasons (
  tax_year integer primary key,
  opens_on date not null,
  closes_on date not null,      -- fecha límite de extensión
  purge_on date not null,       -- exportación al graduado antes; borrado ese día
  check (opens_on < closes_on and closes_on <= purge_on)
);
insert into public.seasons (tax_year, opens_on, closes_on, purge_on)
values (2026, '2026-11-01', '2027-10-15', '2027-10-31');

-- ───────────────────────── Firma del graduado ─────────────────────────
create table public.firms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  logo_path text,
  ptin_last4 text check (ptin_last4 ~ '^[0-9]{4}$'),
  efin_status text not null default 'pendiente' check (efin_status in ('pendiente','solicitado','aprobado')),
  stripe_account_id text unique,
  stripe_charges_enabled boolean not null default false,
  agreement_version text,
  agreement_signed_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function private.owns_firm(p_firm uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.firms f where f.id = p_firm and f.owner_id = auth.uid());
$$;
revoke execute on function private.owns_firm(uuid) from public;
grant execute on function private.owns_firm(uuid) to authenticated;

-- ───────────────────────── Clientes del graduado ─────────────────────────
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  full_name text not null,
  email text,
  phone_e164 text,
  preferred_locale text not null default 'es' check (preferred_locale in ('es','en')),
  ssn_enc text,                                        -- cifrado por la app
  ssn_last4 text check (ssn_last4 ~ '^[0-9]{4}$'),     -- para mostrar enmascarado
  dob_enc text,                                        -- cifrado por la app
  created_at timestamptz not null default now()
);
create index on public.clients (firm_id);

-- ───────────────────────── Casos (un cliente en una temporada) ─────────────────────────
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  tax_year integer not null references public.seasons(tax_year),
  status text not null default 'recepcion'
    check (status in ('recepcion','listo_para_preparar','en_revision','devuelta','aprobada','enviada','cerrada')),
  questionnaire jsonb not null default '{}'::jsonb,
  questionnaire_completed_at timestamptz,
  score integer check (score between 0 and 100),
  score_reasons jsonb not null default '[]'::jsonb,
  score_version text,
  review_mode text check (review_mode in ('rapida','a_fondo')),
  random_audit boolean not null default false,
  filed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, tax_year)
);
create index on public.cases (firm_id, tax_year);

-- el cliente del caso debe ser de la misma firma
create or replace function private.case_client_same_firm() returns trigger
language plpgsql set search_path = '' as $$
declare v_internal boolean := coalesce(current_setting('la.internal', true), '') = 'on';
begin
  if not exists (select 1 from public.clients c where c.id = new.client_id and c.firm_id = new.firm_id) then
    raise exception 'cliente_de_otra_firma';
  end if;
  -- el puntaje lo escribe solo el servidor (service role: auth.uid() es null)
  if auth.uid() is not null and (tg_op = 'INSERT' or
     (new.score, new.score_reasons, new.score_version, new.review_mode, new.random_audit)
       is distinct from (old.score, old.score_reasons, old.score_version, old.review_mode, old.random_audit)) then
    if tg_op = 'INSERT' and new.score is null and new.score_reasons = '[]'::jsonb and new.review_mode is null
       and not new.random_audit then null;  -- alta normal, sin puntaje
    else raise exception 'puntaje_solo_servidor'; end if;
  end if;
  -- los estados de revisión los ponen los triggers de return_reviews, nunca el graduado
  if not v_internal and new.status in ('en_revision','aprobada','devuelta')
     and (tg_op = 'INSERT' or new.status is distinct from old.status) then
    raise exception 'estado_de_revision_reservado';
  end if;
  if tg_op = 'UPDATE' and new.status = 'enviada' and old.status is distinct from 'enviada'
     and old.status <> 'aprobada' then
    raise exception 'enviar_requiere_aprobacion';
  end if;
  new.updated_at := now();
  return new;
end; $$;
create trigger cases_same_firm before insert or update on public.cases
  for each row execute function private.case_client_same_firm();

create or replace function private.owns_case(p_case uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.cases c join public.firms f on f.id = c.firm_id
                 where c.id = p_case and f.owner_id = auth.uid());
$$;

-- ───────────────────────── Documentos del caso ─────────────────────────
create table public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  kind text not null check (kind in ('w2','1099-nec','1099-misc','1099-k','1099-int','1099-div','1099-r',
                                     '1099-b','1099-g','ssa-1099','1098','1098-t','1095-a','identificacion','otro')),
  label text,
  status text not null default 'esperado' check (status in ('esperado','recibido','no_aplica')),
  storage_path text,                   -- depósito 'documentos'; contenido cifrado por la app
  mime_type text check (mime_type in ('image/jpeg','application/pdf')),
  size_bytes integer check (size_bytes > 0 and size_bytes <= 4194304),
  sha256 text,
  key_version smallint,
  uploaded_by text check (uploaded_by in ('cliente','graduado')),
  uploaded_at timestamptz,
  extracted jsonb,                     -- datos no sensibles leídos por la IA
  extracted_secure_enc text,           -- datos sensibles leídos por la IA, cifrados por la app
  created_at timestamptz not null default now(),
  check ((status = 'recibido') = (storage_path is not null))
);
create index on public.case_documents (case_id);

-- ───────────────────────── Revisión de Liliana ─────────────────────────
create table public.return_reviews (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  version integer not null default 1,
  pdf_path text not null,              -- depósito 'declaraciones'; cifrado por la app
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 4194304),
  sha256 text not null,
  key_version smallint not null,
  submitted_by uuid not null references public.profiles(id),
  submitted_at timestamptz not null default now(),
  decision text check (decision in ('aprobada','devuelta')),
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  notes text,
  unique (case_id, version)
);
create index on public.return_reviews (case_id);

-- la directora solo ve casos que el graduado ya mandó a revisión
create or replace function private.directora_can_see_case(p_case uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_directora() and exists (select 1 from public.return_reviews r where r.case_id = p_case);
$$;

create table public.review_packs (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  tax_year integer not null references public.seasons(tax_year),
  reviews integer not null default 10 check (reviews > 0),
  stripe_session_id text unique,
  purchased_at timestamptz not null default now()
);

create table public.violations (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  case_id uuid references public.cases(id) on delete set null,
  tax_year integer not null references public.seasons(tax_year),
  kind text not null check (kind in ('envio_sin_aprobacion')),
  noted_by uuid references public.profiles(id),
  noted_at timestamptz not null default now(),
  note text
);

-- Cupo: 15 casos revisados por temporada (plans.return_reviews) + paquetes. Un caso devuelto y
-- reenviado cuenta una sola vez.
create view public.firm_review_quota with (security_invoker = true) as
  select f.id as firm_id, s.tax_year,
         (select p.return_reviews from public.plans p where p.id = 'mentoria')
           + coalesce((select sum(rp.reviews) from public.review_packs rp
                       where rp.firm_id = f.id and rp.tax_year = s.tax_year), 0) as allowed,
         (select count(distinct r.case_id) from public.return_reviews r
            join public.cases c on c.id = r.case_id
           where c.firm_id = f.id and c.tax_year = s.tax_year) as used,
         (select count(*) from public.violations v
           where v.firm_id = f.id and v.tax_year = s.tax_year) as strikes
    from public.firms f cross join public.seasons s;

-- Reglas al mandar a revisión: cupo, suspensión por segunda falta, decisión vacía.
create or replace function private.before_review_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_firm uuid; v_year int; v_allowed int; v_used int; v_strikes int; v_new_case boolean;
begin
  select c.firm_id, c.tax_year into v_firm, v_year from public.cases c where c.id = new.case_id;
  select count(*) into v_strikes from public.violations v where v.firm_id = v_firm and v.tax_year = v_year;
  if v_strikes >= 2 then raise exception 'revision_suspendida'; end if;

  v_new_case := not exists (select 1 from public.return_reviews r where r.case_id = new.case_id);
  if v_new_case then
    select q.allowed, q.used into v_allowed, v_used from public.firm_review_quota q
     where q.firm_id = v_firm and q.tax_year = v_year;
    if v_used >= v_allowed then raise exception 'cupo_agotado'; end if;
  end if;

  if exists (select 1 from public.return_reviews r where r.case_id = new.case_id and r.decision is null) then
    raise exception 'revision_pendiente';
  end if;
  new.version := coalesce((select max(r.version) from public.return_reviews r where r.case_id = new.case_id), 0) + 1;
  new.decision := null; new.decided_by := null; new.decided_at := null; new.notes := null;
  return new;
end; $$;
create trigger return_reviews_before_insert before insert on public.return_reviews
  for each row execute function private.before_review_insert();

-- Al decidir: solo cambian los campos de decisión; el caso cambia de estado.
create or replace function private.before_review_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (new.case_id, new.version, new.pdf_path, new.size_bytes, new.sha256, new.key_version, new.submitted_by, new.submitted_at)
     is distinct from
     (old.case_id, old.version, old.pdf_path, old.size_bytes, old.sha256, old.key_version, old.submitted_by, old.submitted_at) then
    raise exception 'solo_campos_de_decision';
  end if;
  if old.decision is not null then raise exception 'ya_decidida'; end if;
  if new.decision is null then raise exception 'falta_decision'; end if;
  if auth.uid() is not null then new.decided_by := auth.uid(); end if;
  new.decided_at := now();
  perform set_config('la.internal', 'on', true);
  update public.cases set status = case new.decision when 'aprobada' then 'aprobada' else 'devuelta' end
   where id = new.case_id;
  perform set_config('la.internal', 'off', true);
  return new;
end; $$;
create trigger return_reviews_before_update before update on public.return_reviews
  for each row execute function private.before_review_update();

create or replace function private.after_review_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform set_config('la.internal', 'on', true);
  update public.cases set status = 'en_revision' where id = new.case_id;
  perform set_config('la.internal', 'off', true);
  return new;
end; $$;
create trigger return_reviews_after_insert after insert on public.return_reviews
  for each row execute function private.after_review_insert();

-- ───────────────────────── Consentimientos y enlaces del cliente ─────────────────────────
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  kind text not null check (kind in ('7216_divulgar','7216_usar')),
  text_version text not null,
  signer_name text not null,
  signed_at timestamptz not null default now(),
  ip inet,
  user_agent text,
  unique (case_id, kind, text_version)
);

-- El cliente no tiene cuenta: entra con un enlace. Solo se guarda el hash del token.
create table public.intake_links (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  token_hash bytea not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Registro de accesos (solo agregar) ─────────────────────────
create table public.access_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_kind text not null check (actor_kind in ('graduado','directora','admin','cliente','sistema')),
  case_id uuid references public.cases(id) on delete set null,
  object_kind text not null check (object_kind in ('documento','declaracion','dato_sensible','exportacion')),
  object_id uuid,
  action text not null check (action in ('ver','descargar','subir','borrar','exportar','revelar')),
  ip inet
);
create index on public.access_log (case_id, at);

create or replace function private.access_log_append_only() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'access_log_solo_agregar'; end; $$;
create trigger access_log_no_update before update on public.access_log
  for each row execute function private.access_log_append_only();
-- (el borrado se permite solo al service role en el purgado anual; las políticas no lo dan a nadie más)

-- ───────────────────────── RLS ─────────────────────────
alter table public.subscriptions enable row level security;
alter table public.seasons enable row level security;
alter table public.firms enable row level security;
alter table public.clients enable row level security;
alter table public.cases enable row level security;
alter table public.case_documents enable row level security;
alter table public.return_reviews enable row level security;
alter table public.review_packs enable row level security;
alter table public.violations enable row level security;
alter table public.consents enable row level security;
alter table public.intake_links enable row level security;   -- sin políticas: solo service role
alter table public.access_log enable row level security;

create policy "subscriptions: own or staff read" on public.subscriptions for select to authenticated
  using (user_id = auth.uid() or private.is_staff());
create policy "seasons: read" on public.seasons for select to authenticated using (auth.uid() is not null);
create policy "seasons: staff write" on public.seasons for all to authenticated using (private.is_staff()) with check (private.is_staff());

create policy "firms: own read" on public.firms for select to authenticated using (owner_id = auth.uid() or private.is_directora());
create policy "firms: own insert" on public.firms for insert to authenticated with check (owner_id = auth.uid());
create policy "firms: own update" on public.firms for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "clients: own firm" on public.clients for all to authenticated
  using (private.owns_firm(firm_id)) with check (private.owns_firm(firm_id));
create policy "clients: directora en revisión" on public.clients for select to authenticated
  using (exists (select 1 from public.cases c where c.client_id = clients.id and private.directora_can_see_case(c.id)));

create policy "cases: own firm" on public.cases for all to authenticated
  using (private.owns_firm(firm_id)) with check (private.owns_firm(firm_id));
create policy "cases: directora en revisión" on public.cases for select to authenticated
  using (private.directora_can_see_case(id));

create policy "documents: own case" on public.case_documents for all to authenticated
  using (private.owns_case(case_id)) with check (private.owns_case(case_id));
create policy "documents: directora en revisión" on public.case_documents for select to authenticated
  using (private.directora_can_see_case(case_id));

create policy "reviews: own read" on public.return_reviews for select to authenticated using (private.owns_case(case_id));
create policy "reviews: own submit" on public.return_reviews for insert to authenticated
  with check (private.owns_case(case_id) and submitted_by = auth.uid());
create policy "reviews: directora read" on public.return_reviews for select to authenticated using (private.is_directora());
create policy "reviews: directora decide" on public.return_reviews for update to authenticated
  using (private.is_directora()) with check (private.is_directora());

create policy "packs: own or directora read" on public.review_packs for select to authenticated
  using (private.owns_firm(firm_id) or private.is_directora());
create policy "violations: own read" on public.violations for select to authenticated using (private.owns_firm(firm_id));
create policy "violations: directora" on public.violations for all to authenticated
  using (private.is_directora()) with check (private.is_directora());

create policy "consents: own read" on public.consents for select to authenticated using (private.owns_case(case_id));
create policy "consents: directora en revisión" on public.consents for select to authenticated
  using (private.directora_can_see_case(case_id));

create policy "access_log: own cases read" on public.access_log for select to authenticated
  using (case_id is not null and private.owns_case(case_id));
create policy "access_log: directora read" on public.access_log for select to authenticated using (private.is_directora());

revoke execute on function private.owns_case(uuid) from public;
revoke execute on function private.directora_can_see_case(uuid) from public;
grant execute on function private.owns_case(uuid), private.directora_can_see_case(uuid) to authenticated;
revoke execute on function private.before_review_insert(), private.before_review_update(),
  private.after_review_insert(), private.case_client_same_firm(), private.access_log_append_only() from public;

-- ───────────────────────── Almacenamiento ─────────────────────────
-- Privados y sin políticas en storage.objects: solo el servidor (service role) accede.
-- El contenido llega cifrado por la app, por eso el tipo es octet-stream.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('documentos',   'documentos',   false, 4194304, array['application/octet-stream']),
  ('declaraciones','declaraciones',false, 4194304, array['application/octet-stream'])
on conflict (id) do nothing;
