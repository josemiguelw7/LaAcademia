\set ON_ERROR_STOP 0
-- datos base (como superusuario)
insert into auth.users(id,email) values
 ('11111111-1111-1111-1111-111111111111','g1@x'),('22222222-2222-2222-2222-222222222222','g2@x'),
 ('33333333-3333-3333-3333-333333333333','lili@x'),('44444444-4444-4444-4444-444444444444','adm@x');
update public.profiles set role='directora' where id='33333333-3333-3333-3333-333333333333';
update public.profiles set role='admin' where id='44444444-4444-4444-4444-444444444444';

create or replace function pg_temp.as_user(u uuid) returns void language plpgsql as $$
begin perform set_config('request.jwt.claim.sub', u::text, false); end $$;

-- G1 crea su firma, cliente y caso
set role authenticated; select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
insert into firms(owner_id,business_name) values (auth.uid(),'Impuestos G1') returning id \gset f1_
insert into clients(firm_id,full_name,ssn_enc,ssn_last4) values (:'f1_id','Cliente Uno','v1.cifrado','1234') returning id \gset c1_
insert into cases(firm_id,client_id,tax_year) values (:'f1_id',:'c1_id',2026) returning id \gset k1_
\echo '-- T1 graduado no puede ponerse aprobada (espera estado_de_revision_reservado)'
update cases set status='aprobada' where id=:'k1_id';
\echo '-- T2 graduado no puede escribir puntaje (espera puntaje_solo_servidor)'
update cases set score=95 where id=:'k1_id';
\echo '-- T3 graduado no puede marcar enviada sin aprobación (espera enviar_requiere_aprobacion)'
update cases set status='enviada' where id=:'k1_id';

-- G2 su propia firma
select pg_temp.as_user('22222222-2222-2222-2222-222222222222');
insert into firms(owner_id,business_name) values (auth.uid(),'Impuestos G2') returning id \gset f2_
\echo '-- T4 G2 no ve clientes ni casos de G1 (espera 0 0)'
select (select count(*) from clients) clientes, (select count(*) from cases) casos;
\echo '-- T5 G2 no puede crear caso en firma de G1 (espera error RLS)'
insert into cases(firm_id,client_id,tax_year) values (:'f1_id',:'c1_id',2026);

\echo '-- T6 directora no ve el caso antes de revisión (espera 0 0)'
select pg_temp.as_user('33333333-3333-3333-3333-333333333333');
select (select count(*) from cases) casos, (select count(*) from clients) clientes;

\echo '-- T7 admin no ve datos de clientes (espera 0 0)'
select pg_temp.as_user('44444444-4444-4444-4444-444444444444');
select (select count(*) from cases) casos, (select count(*) from clients) clientes;

\echo '-- G1 manda a revisión'
select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
insert into return_reviews(case_id,pdf_path,size_bytes,sha256,key_version,submitted_by) values (:'k1_id','g1/k1/v1.bin',1000,'abc',1,auth.uid()) returning id \gset r1_
select status from cases where id=:'k1_id';
\echo '-- T8 G1 no puede autoaprobar (espera 0 filas actualizadas)'
update return_reviews set decision='aprobada' where id=:'r1_id';
\echo '-- T9 segundo envío con revisión pendiente (espera revision_pendiente)'
insert into return_reviews(case_id,pdf_path,size_bytes,sha256,key_version,submitted_by) values (:'k1_id','x',1,'a',1,auth.uid());

\echo '-- T10 directora ahora ve caso y cliente (espera 1 1)'
select pg_temp.as_user('33333333-3333-3333-3333-333333333333');
select (select count(*) from cases) casos, (select count(*) from clients) clientes;
\echo '-- T11 directora no puede cambiar el PDF (espera solo_campos_de_decision)'
update return_reviews set pdf_path='otro' where id=:'r1_id';
\echo '-- T12 directora devuelve con notas'
update return_reviews set decision='devuelta', notes='Falta el 1099-NEC' where id=:'r1_id';
select status from cases where id=:'k1_id';
\echo '-- T13 no se puede volver a decidir (espera ya_decidida)'
update return_reviews set decision='aprobada' where id=:'r1_id';

\echo '-- G1 reenvía y la directora aprueba; luego G1 marca enviada'
select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
insert into return_reviews(case_id,pdf_path,size_bytes,sha256,key_version,submitted_by) values (:'k1_id','g1/k1/v2.bin',1000,'def',1,auth.uid()) returning id, version \gset r2_
select pg_temp.as_user('33333333-3333-3333-3333-333333333333');
update return_reviews set decision='aprobada' where id=:'r2_id';
select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
update cases set status='enviada' where id=:'k1_id';
select status, (select used from firm_review_quota q where q.firm_id=:'f1_id') usado,
       (select allowed from firm_review_quota q where q.firm_id=:'f1_id') permitido from cases where id=:'k1_id';

\echo '-- T14 cupo: con 15 casos usados, el 16 falla (espera cupo_agotado)'
reset role;
insert into clients(firm_id,full_name) select :'f1_id','c'||g from generate_series(2,16) g;
insert into cases(firm_id,client_id,tax_year) select :'f1_id',id,2026 from clients where full_name like 'c%';
insert into return_reviews(case_id,pdf_path,size_bytes,sha256,key_version,submitted_by)
  select k.id,'p',1,'s',1,'11111111-1111-1111-1111-111111111111' from cases k join clients c on c.id=k.client_id
  where c.full_name in ('c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12','c13','c14','c15');
set role authenticated; select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
select used, allowed from firm_review_quota where firm_id=:'f1_id';
insert into return_reviews(case_id,pdf_path,size_bytes,sha256,key_version,submitted_by)
  select k.id,'p',1,'s',1,auth.uid() from cases k join clients c on c.id=k.client_id where c.full_name='c16';

\echo '-- T15 registro de accesos no se puede editar (espera access_log_solo_agregar)'
reset role;
insert into access_log(actor_kind,case_id,object_kind,action) values ('directora',:'k1_id','declaracion','ver');
update access_log set action='borrar';
\echo '-- T16 G2 no ve el registro de G1 (espera 0); G1 sí (espera 1)'
set role authenticated; select pg_temp.as_user('22222222-2222-2222-2222-222222222222'); select count(*) from access_log;
select pg_temp.as_user('11111111-1111-1111-1111-111111111111'); select count(*) from access_log;
\echo '-- T17 nadie autenticado ve intake_links (espera 0)'
select count(*) from intake_links;
\echo '-- T18 anon no ve nada de la plataforma (espera 0 0)'
reset role; set role anon; select pg_temp.as_user(null);
select (select count(*) from firms), (select count(*) from cases);
