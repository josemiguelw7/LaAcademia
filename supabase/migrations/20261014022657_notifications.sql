-- Avisos dentro de la app. Los crea la base en el momento en que pasan las cosas, así ninguna ruta se los salta.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('revision_nueva','revision_aprobada','revision_devuelta','documento_recibido','permiso_firmado')),
  title text not null,
  body text,
  href text,
  case_id uuid references public.cases(id) on delete cascade,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index on public.notifications (user_id, created_at desc);
alter table public.notifications enable row level security;
create policy "notifications: own read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "notifications: own mark read" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function private.notifications_only_read_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.user_id, new.kind, new.title, new.body, new.href, new.case_id, new.created_at)
     is distinct from (old.user_id, old.kind, old.title, old.body, old.href, old.case_id, old.created_at) then
    raise exception 'solo_marcar_leido';
  end if;
  return new;
end; $$;
create trigger notifications_only_read_at before update on public.notifications
  for each row execute function private.notifications_only_read_at();

-- Declaración nueva → Liliana. Decisión → el graduado.
create or replace function private.notify_review() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_client text; v_firm text; v_owner uuid;
begin
  select cl.full_name, f.business_name, f.owner_id into v_client, v_firm, v_owner
    from public.cases c join public.clients cl on cl.id = c.client_id join public.firms f on f.id = c.firm_id
   where c.id = new.case_id;
  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, kind, title, body, href, case_id)
    select p.id, 'revision_nueva', 'Declaración para revisar', v_firm || ' · ' || v_client || case when new.version > 1 then ' · versión ' || new.version else '' end,
           '/panel/revisiones/' || new.id, new.case_id
      from public.profiles p where p.role = 'directora';
  elsif new.decision is not null and old.decision is null then
    insert into public.notifications (user_id, kind, title, body, href, case_id)
    values (v_owner, case new.decision when 'aprobada' then 'revision_aprobada' else 'revision_devuelta' end,
            case new.decision when 'aprobada' then 'Liliana aprobó la declaración de ' || v_client else 'Liliana te devolvió la declaración de ' || v_client end,
            case when new.decision = 'devuelta' then left(new.notes, 140) end,
            '/negocio/casos/' || new.case_id, new.case_id);
  end if;
  return null;
end; $$;
create trigger return_reviews_notify after insert or update on public.return_reviews
  for each row execute function private.notify_review();

-- El cliente sube un documento o firma su permiso → el graduado.
create or replace function private.notify_client_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_client text; v_owner uuid;
begin
  select cl.full_name, f.owner_id into v_client, v_owner
    from public.cases c join public.clients cl on cl.id = c.client_id join public.firms f on f.id = c.firm_id
   where c.id = new.case_id;
  if tg_table_name = 'consents' then
    insert into public.notifications (user_id, kind, title, href, case_id)
    values (v_owner, 'permiso_firmado', v_client || ' firmó su permiso', '/negocio/casos/' || new.case_id, new.case_id);
  elsif new.status = 'recibido' and new.uploaded_by = 'cliente' and (old.uploaded_at is distinct from new.uploaded_at) then
    insert into public.notifications (user_id, kind, title, body, href, case_id)
    values (v_owner, 'documento_recibido', v_client || ' subió un documento', coalesce(new.label, new.kind), '/negocio/casos/' || new.case_id, new.case_id);
  end if;
  return null;
end; $$;
create trigger consents_notify after insert on public.consents
  for each row execute function private.notify_client_activity();
create trigger case_documents_notify after update on public.case_documents
  for each row execute function private.notify_client_activity();

revoke execute on function private.notify_review(), private.notify_client_activity(), private.notifications_only_read_at() from public;
