\echo -- avisos generados por el flujo de prueba (espera: revisiones nuevas para Liliana y decisiones para G1)
select p.role, n.kind, count(*) from notifications n join profiles p on p.id = n.user_id group by 1,2 order by 1,2;
set role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
\echo -- G2 no ve avisos de otros (espera 0)
select count(*) from notifications;
select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
\echo -- G1 marca leído (espera UPDATE) y no puede cambiar el texto (espera solo_marcar_leido)
update notifications set read_at = now() where user_id = auth.uid();
update notifications set title = 'x' where user_id = auth.uid();
