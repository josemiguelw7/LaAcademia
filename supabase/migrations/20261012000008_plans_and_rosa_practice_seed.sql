-- Planes (precios PROPUESTOS en docs/02; Liliana los aprueba antes de vender)
insert into public.plans (id, name, price_cents, whatsapp_access, group_sessions, calls_per_month, return_reviews, seats) values
 ('curso','Curso',49700,'none',false,0,0,null),
 ('soporte','Curso + soporte de temporada',89700,'season',true,0,0,null),
 ('mentoria','Mentoría',149700,'year',true,1,3,12)
on conflict (id) do nothing;

-- Práctica del módulo 6: Anexo C de Rosa (expected_expr se evalúa contra la tabla cifras al calificar)
with p as (select id from public.practices where code = '06-anexo-c-rosa'),
c as (
  insert into public.practice_cases (practice_id, position, title, narrative, documents)
  select p.id, 1, 'Rosa Delgado · comida los fines de semana',
   'Rosa vende comida los fines de semana desde hace dos años: tamales por encargo y un puesto los domingos. Cocina en una cocina comercial que renta por horas y lleva los pedidos y las cuentas desde un rincón de su casa. Soltera, sin dependientes, con Seguro Social.',
   '[{"t":"1099-K de su app de pagos","d":"Bruto $24,600 · 410 transacciones"},
     {"t":"Resumen anual de la app","d":"Comisiones cobradas: $738"},
     {"t":"Cuaderno de ventas en efectivo","d":"Total del año: $11,400"},
     {"t":"Recibos de ingredientes","d":"Masa, carne, chiles, hojas: $12,300"},
     {"t":"Recibos de desechables","d":"Bolsas, charolas, servilletas: $1,150"},
     {"t":"Renta de la cocina comercial","d":"Recibos mensuales: $3,120 en el año"},
     {"t":"Permiso de salud del condado","d":"$310"},
     {"t":"Factura anual del celular","d":"$960. «Lo uso para pedidos más o menos 40 %; tengo capturas de un mes.»"},
     {"t":"App de millas","d":"Enero–junio: 1,960 millas de negocio. Julio–diciembre: 2,080. Incluye mercado, entregas y los viajes de su casa a la cocina rentada (1,040 de las 4,040)."},
     {"t":"Rincón de pedidos en su casa","d":"60 pies cuadrados, uso exclusivo y semanal para pedidos, etiquetas y cuentas. No tiene otro local fijo propio."},
     {"t":"«Por si acaso»","d":"Ropa para vender los domingos: $280. Multa de estacionamiento cerca del mercado: $75."}]'::jsonb
  from p returning id
)
insert into public.practice_boxes (case_id, line_no, label, expected_expr, kind, note_on_error)
select c.id, b.line_no, b.label, b.expr, 'input', b.notes::jsonb from c, (values
 ('1','Gross receipts or sales','36000','{"24600":"Casi. El 1099-K es lo que la app reportó, no todo lo que entró. El efectivo del cuaderno también es ingreso del negocio.","23862":"Casi. El 1099-K va en bruto, completo. Las comisiones bajan después como gasto en la línea 10.","_":"Casi. Suma todo lo que entró por el negocio: la app en bruto más el efectivo del cuaderno."}'),
 ('4','Cost of goods sold (Part III)','12300','{"_":"Casi. Los ingredientes se transforman en lo que Rosa vende: son costo de mercancía, Parte III."}'),
 ('9','Car and truck expenses','1960*cifra(''tarifa_millas'',''ene-jun'') + 2080*cifra(''tarifa_millas'',''jul-dic'')','{"4040*cifra(''tarifa_millas'',''ene-jun'')":"Casi. Este año la tarifa cambió a mitad de año. Cada periodo se multiplica por su propia tarifa.","4040*cifra(''tarifa_millas'',''jul-dic'')":"Casi. Este año la tarifa cambió a mitad de año. Cada periodo se multiplica por su propia tarifa.","1460*cifra(''tarifa_millas'',''ene-jun'') + 1540*cifra(''tarifa_millas'',''jul-dic'')":"Casi. Los viajes de su casa a la cocina rentada sí cuentan: su casa es su lugar principal de negocio por la puerta administrativa (lección 6.4).","_":"Casi. Millas de cada periodo por la tarifa de ese periodo, sumadas. Las 4,040 millas cuentan."}'),
 ('10','Commissions and fees','738','{"_":"Casi. Las comisiones de la app son gasto del negocio. El resumen anual es el recibo exacto."}'),
 ('20b','Rent: other business property','3120','{"_":"Casi. La cocina rentada es renta de un local del negocio: línea 20b."}'),
 ('22','Supplies','1150','{"1430":"Casi. La ropa de los domingos es ropa normal. Lo que también sirve para tu vida diaria no es del negocio.","_":"Casi. Desechables: bolsas, charolas y servilletas."}'),
 ('23','Taxes and licenses','310','{"385":"Casi. Las multas nunca se deducen, aunque la hayan puesto mientras trabajaba.","_":"Casi. El permiso de salud del condado va aquí."}'),
 ('25','Utilities (celular)','384','{"960":"Casi. Solo la parte de negocio se deduce: 40 % de 960, con el criterio anotado al expediente.","_":"Casi. Solo el porcentaje de negocio del celular."}'),
 ('30','Business use of home (simplificado)','60*cifra(''tarifa_oficina_simplificada'')','{"0":"Casi. Rosa pasa las pruebas: rincón exclusivo, uso semanal, y es su lugar principal por la administración.","_":"Casi. Pies cuadrados del rincón por la tarifa del método simplificado."}')
) as b(line_no, label, expr, notes);
