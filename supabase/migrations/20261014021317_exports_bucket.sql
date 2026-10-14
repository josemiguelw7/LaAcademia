-- Archivo de fin de temporada del graduado: un zip temporal, privado, que se descarga con enlace firmado
-- de pocos minutos y se borra al día siguiente. Sin políticas: solo el servidor lo toca.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('exportaciones', 'exportaciones', false, 52428800, array['application/zip'])
on conflict (id) do nothing;

-- El registro de accesos sigue siendo de solo agregar, pero al borrar un caso o un perfil la base pone
-- en null la referencia (on delete set null). Esa es la única actualización permitida.
create or replace function private.access_log_append_only() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (new.id, new.at, new.actor_kind, new.object_kind, new.object_id, new.action, new.ip)
       is not distinct from (old.id, old.at, old.actor_kind, old.object_kind, old.object_id, old.action, old.ip)
     and (new.case_id is null or new.case_id = old.case_id)
     and (new.actor_id is null or new.actor_id = old.actor_id) then
    return new;
  end if;
  raise exception 'access_log_solo_agregar';
end; $$;
