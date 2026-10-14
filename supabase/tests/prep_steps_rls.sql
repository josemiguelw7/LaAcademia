set role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
insert into prep_steps(user_id,step) values (auth.uid(),'ptin');
\echo -- otro usuario no puede marcar por G1 (espera error)
select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
insert into prep_steps(user_id,step) values ('11111111-1111-1111-1111-111111111111','eservices');
\echo -- G2 no ve los pasos de G1 (espera 0)
select count(*) from prep_steps;
\echo -- fecha
select value from settings where key='efin_deadline';
