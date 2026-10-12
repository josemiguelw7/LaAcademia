---
id: 06-anexo-c-rosa
module: 6
title: Arma el Anexo C de Rosa
unlocks_after: [06-01, 06-02, 06-03, 06-04, 06-05]
status: draft
cifras: [tarifa_millas, tarifa_oficina_simplificada, umbral_1099k, umbral_se]
---

# Práctica del módulo 6 · Arma el Anexo C de Rosa

Formato: la réplica interactiva del Anexo C (Schedule C), con las etiquetas oficiales en inglés, cuadrícula de 1 px tinta y radio de 4 px. A un lado, los «Documentos» de Rosa (en móvil, pestaña aparte). El alumno llena cada casilla editable; las líneas calculadas (7, 28, 31) quedan en gris y las calcula la app. Al pulsar «Revisar», cada casilla se marca ✓ o ✕ con su explicación debajo, y arriba aparece «x de 10 casillas correctas». Botones «Revisar de nuevo» y «Pista». Reintentos ilimitados; se domina con las 10 casillas correctas y las 3 decisiones de la parte B.

Los valores esperados que dependen de cifras del año (millas y oficina) se calculan con la tabla `cifras` del año fiscal del caso. Nunca se escriben a mano en el código.

## Los documentos de Rosa

Rosa Delgado vende comida los fines de semana desde hace dos años: tamales por encargo y un puesto los domingos. Cocina en una cocina comercial que renta por horas. Lleva los pedidos y las cuentas desde un rincón de su casa. Soltera, sin dependientes, con Seguro Social.

Lo que trae a la mesa:

1. **1099-K** de su app de pagos: bruto $24,600, 410 transacciones.
2. **Resumen anual de la app:** comisiones cobradas $738.
3. **Cuaderno de ventas en efectivo**, día por día: total $11,400.
4. **Recibos de ingredientes** de cada semana (masa, carne, chiles, hojas): total $12,300.
5. **Recibos de desechables** (bolsas, charolas, servilletas): $1,150.
6. **Renta de la cocina comercial**, recibos mensuales: $3,120 en el año.
7. **Permiso de salud del condado:** $310.
8. **Factura anual del celular:** $960. Nota de Rosa: «lo uso para pedidos más o menos 40 %; tengo las capturas de un mes».
9. **App de millas:** enero–junio 1,960 millas de negocio; julio–diciembre 2,080 millas de negocio. Incluye compras en el mercado, entregas, y los viajes de su casa a la cocina rentada (1,040 de las 4,040).
10. **El rincón de pedidos en su casa:** 60 pies cuadrados, uso exclusivo y semanal para pedidos, etiquetas y cuentas. Sin otro local fijo propio.
11. **Otros papeles que trae «por si acaso»:** ropa que usa para vender los domingos $280; una multa de estacionamiento cerca del mercado $75.

## Parte A · Las casillas

| Línea | Esperado | Si se equivoca |
|---|---|---|
| 1 · Gross receipts | 36,000 (24,600 de la app + 11,400 en efectivo) | Solo 24,600: «Casi. El 1099-K es lo que la app reportó, no todo lo que entró. El efectivo del cuaderno también es ingreso del negocio.» · 23,862: «Casi. El 1099-K va en bruto, completo. Las comisiones bajan después, como gasto en la línea 10, para que tu bruto cuadre con lo que el IRS ya tiene.» |
| 4 · Cost of goods sold (Parte III) | 12,300 | En línea 22: «Casi. Los ingredientes se transforman en lo que Rosa vende: son costo de mercancía, Parte III, no insumos.» |
| 9 · Car and truck expenses | Millas de cada periodo × la tarifa de ese periodo (tarjeta `tarifa_millas`), sumadas. Las 4,040 millas cuentan. | Una sola tarifa para todo el año: «Casi. Este año la tarifa cambió a mitad de año. Cada periodo se multiplica por su propia tarifa.» · Sin las 1,040 de casa a cocina: «Casi. Normalmente ese viaje sería trayecto personal. Pero la casa de Rosa es su lugar principal de negocio por la puerta administrativa (lección 6.4): de ahí a la cocina, es viaje de negocio.» |
| 10 · Commissions and fees | 738 | Vacío: «Casi. Las comisiones de la app son gasto del negocio. El resumen anual es el recibo exacto.» |
| 20b · Rent: other business property | 3,120 | En línea 30: «Casi. La cocina rentada no es su casa. Es renta de un local del negocio, línea 20b.» |
| 22 · Supplies | 1,150 | 1,430: «Casi. La ropa de los domingos es ropa normal. Lo que también sirve para tu vida diaria no es del negocio.» |
| 23 · Taxes and licenses | 310 | 385: «Casi. Las multas nunca se deducen, aunque la hayan puesto mientras trabajaba.» |
| 25 · Utilities (celular) | 384 (40 % de 960) | 960: «Casi. Solo la parte de negocio se deduce. Rosa estimó 40 % y tiene capturas de un mes: ese es el criterio, y va anotado al expediente.» |
| 30 · Business use of home | 60 × la tarifa del método simplificado (tarjeta `tarifa_oficina_simplificada`) | Vacío: «Casi. Rosa pasa las pruebas: rincón exclusivo, uso semanal, y es su lugar principal por la administración. Negarle la deducción por miedo es mal servicio.» · Con 8829 sin recibos de la casa: «Casi. Sin recibos de renta y servicios de su casa no puedes comparar. Con lo que trajo, el simplificado es el método.» |
| 31 · Net profit (calculada) | La app la calcula y la marca ✓ si las anteriores están bien | — |

Pista: «Primero separa los papeles en tres montones: lo que entró, lo que gastó el negocio, y lo que no es del negocio.»

## Parte B · Tres decisiones después del Anexo C

Tres preguntas de opción múltiple sobre el resultado de Rosa, con el neto que ella misma calculó en la parte A.

1. **¿Rosa paga impuesto de trabajo por cuenta propia?** Correcta: «Sí. Su ganancia neta pasa el umbral del Anexo SE. Paga 15.3 % sobre el 92.35 % de su neto, y la mitad se le deduce en el Anexo 1.» Distractores: «No, porque ya paga impuesto sobre la renta» → «Casi. El SE es aparte: es su Seguro Social y Medicare como dueña.» · «Sí, 15.3 % sobre todo el neto» → «Casi. Se aplica sobre el 92.35 % del neto, no sobre el total.»
2. **¿Rosa necesita pagos estimados el año que viene?** Correcta: «Sí. Nadie le retiene. Se le montan las cuatro fechas del 1040-ES, con el puerto seguro del 100 % de este año.» Distractores: «No, paga todo en abril» → «Casi. Sin estimados, se le puede cobrar una multa por pago insuficiente aunque pague completo en abril.» · «Solo si gana más el año que viene» → «Casi. El puerto seguro existe justo por eso: si paga en el año lo de este año, queda protegida gane lo que gane.»
3. **¿Qué va al expediente de Rosa?** Correcta: «El 1099-K, el resumen de comisiones, el cuaderno de efectivo, los recibos por categoría, la nota del 40 % del celular, el registro de millas por periodo, y la medición y foto del rincón.» Distractores: «Solo el 1099-K, que es lo que el IRS ya tiene» → «Casi. El 1099-K es lo único que el IRS ya ve. Todo lo demás lo tienes que poder probar tú.» · «Nada: Rosa guarda sus papeles» → «Casi. Tu firma va en la declaración. El expediente es tu respaldo.»

## Verificación interna (no se muestra al alumno)

Con las cifras de 2026 (millas 72.5¢ ene–jun y 76¢ jul–dic; oficina $5 por pie cuadrado): línea 9 = 1,421.00 + 1,580.80 = 3,001.80 · línea 30 = 300 · total de gastos 9,003.80 · línea 7 (bruto − mercancía) = 23,700 · línea 31 = 14,696.20 · base SE (× 92.35 %) = 13,571.94 · SE = 2,076.51 · mitad deducible = 1,038.25. La app recalcula todo con la tabla `cifras`; estos números son solo para que Liliana revise el caso.

## Notas para Liliana

- Rosa en los prototipos de diseño era repartidora; en las lecciones aprobadas es vendedora de comida. Esta práctica sigue las lecciones.
- La línea del celular: ¿lo enseñas en la 25 (utilities) o en la 27a (other expenses)? Lo dejé en la 25; se acepta cualquiera de las dos si prefieres.
- Confirmar que el método simplificado de la oficina usa la tarifa por pie cuadrado de siempre; quedó en la tarjeta `tarifa_oficina_simplificada`.
