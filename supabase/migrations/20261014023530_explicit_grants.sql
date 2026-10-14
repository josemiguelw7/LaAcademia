-- Permisos explícitos sobre las tablas. Supabase los da por defecto en el proyecto principal, pero una
-- rama nueva (o un proyecto recreado desde las migraciones) puede nacer sin ellos. Las reglas de acceso
-- (RLS) siguen decidiendo qué filas ve cada quien; esto solo abre la puerta de la tabla.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
