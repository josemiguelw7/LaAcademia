\echo -- borrar un caso con registros de acceso (espera DELETE sin error)
delete from cases where id in (select id from cases limit 3);
select count(*) as logs_sin_caso from access_log where case_id is null;
\echo -- editar la acción de un registro sigue prohibido (espera access_log_solo_agregar)
update access_log set action='borrar';
