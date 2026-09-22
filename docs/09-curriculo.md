# 09 · Currículo v1 — 8 módulos, 30 lecciones

Estado: **propuesta para aprobación de Liliana** (21 sept 2026; principios actualizados 22 sept con su retroalimentación — ver `10-feedback-liliana.md`). Liliana va a hacer su propia pasada sobre esta lista; la estructura final se cierra cuando llegue. Sustituye la tabla de mapeo de `05-contenido.md` y el «25 lecciones» del diseño. Cuando Liliana apruebe, este documento es la fuente de verdad del contenido; `05-contenido.md` conserva las reglas de reescritura y el pipeline.

Cómo se construyó: se leyeron completos los 10 guiones Maestro, el complemento de ITIN, el bono «Rumbo al Éxito», la «Guía Completa para Convertirse en Preparador» y el examen final (100 preguntas). Las clases grabadas en vivo (2025) se tomaron por título; no están transcritas. Cada lección de abajo dice de qué archivo sale, qué le falta y qué hay que corregir.

---

## 1. Principios que rigen la estructura

1. **Lecciones cortas, muchas.** Ninguna pasa de 12 minutos; la mayoría dura 6–9. Lo que aburre no es el número de lecciones sino el largo de cada una. Cada lección es un punto de guardado en la mecánica de dominio (8 de 10) y un momento de «lo logré».
2. **Una lección = una decisión que el preparador toma en la vida real.** No «los formularios», sino «leer un W-2 sin errores». Si el título no describe algo que el alumno hará con un cliente, está mal planteada.
3. **5–8 segmentos de 60–120 segundos, una pregunta después de cada segmento**, 10 preguntas por lección en total (algunas lecciones tienen 2 preguntas después de un segmento denso). Cada pregunta con 3 opciones y retroalimentación por cada opción incorrecta que nombre la confusión exacta.
4. **Ningún monto en el guion.** Se dice «la deducción estándar de este año»; la app muestra la tarjeta desde la tabla `cifras`. Cada lección lista abajo sus `cifra_concept`.
5. **Historias de Liliana donde haya una fuerte**, de su práctica o de su paso por el IRS como Tax Examiner. Son opcionales: su experiencia es el hilo conductor, no una anécdota obligatoria por lección. Los guiones originales no tienen ninguna; se recogen con ella (ver §8).
5b. **Un cliente recorre todo el curso.** María Ortega (`content/casos/maria.md`): el alumno la entrevista, decide su estado civil, captura sus documentos, revisa sus créditos, hace su Anexo C y revisa su declaración antes de transmitir. Al terminar, preparó una declaración, no vio 30 videos.
5c. **Cada lección sigue la misma secuencia** (qué resuelves → regla → qué preguntas → qué evidencia buscas → caso → decisión → por qué las otras están mal → dónde va en la 1040 → qué guardas → checklist). Detalle en `content/README.md`.
5d. **Demos de software aparte.** Las lecciones son neutrales; cada una puede llevar una demo «Ahora míralo en el software» de 2–5 min que se regraba por temporada.
6. **La práctica no enseña lo que el video se saltó.** Aplica lo que ya se entendió. Por eso el intake y la debida diligencia son lecciones, no ejercicios.
7. **Orden pedagógico, no el orden del diseño.** Familia (estado civil, dependientes) va **antes** de deducciones y créditos, porque EITC, CTC y cabeza de familia dependen de quién vive en la casa. Anexo C va después, cuando el alumno ya tiene ritmo.

---

## 2. Inventario de fuentes

| Archivo (Drive) | Qué cubre de verdad | Calidad para reutilizar | Va a |
|---|---|---|---|
| Lección 1 Maestro | Definiciones preparador/contribuyente/IRS; responsabilidades de cada uno | Media. Sin cifras, sin casos | 1.1, 2.2 |
| Lección 2 Maestro | Historia del Tío Sam; qué es impuesto sobre la renta; en qué se gasta | Baja. Ejemplo ficticio (20 % plano), no explica tramos reales | 1.2 (solo la anécdota) |
| Lección 3 Maestro | 5 estados civiles, cabeza de familia, hijo/pariente calificado | **Alta**. La más completa. Límite de ingreso del pariente desactualizado | 3.1, 3.2 |
| Lección 4 Maestro | Créditos reembolsables/no, Anexo A, estándar 2024 | Media. Cifras 2024, sin 8867, error en HOH 2024 | 5.1, 5.3, 5.5 |
| Lección 5 Maestro | Tipos de ingreso, tipos de impuesto, quién declara | Media. Buena taxonomía, sin formularios | 1.3, 4.3, 4.4 |
| Lección 6 Maestro | 1040, 1040-X, 1095-A, W-7 | Baja-media. Definiciones cortas | 1.2, 5.5, 7.3 |
| Lección 7 Maestro | Anexos A, B, C, D, 1, 2, 3; EITC | Media. **Error: dice que el EITC va en el Anexo 3**. Promete Anexo C «en profundidad» y no lo hace | 5.2, 6.1, 6.5 |
| Lección 8 Maestro | W-2, 1099 (MISC/NEC/INT/DIV/G/R), 1098/E/T | Baja. Lista de definiciones; no va casilla por casilla; sin 1099-K ni SSA-1099 | 4.1, 4.2, 4.4 |
| Lección 9 Maestro | 10 puntos del preparador (ética, cálculo, organización, auditorías, tecnología, desarrollo) | Media. Genérico; no tiene la lista de errores reales; **no cubre PTIN/EFIN aunque la L8 lo prometió** | 2.2, 7.1, 8.3 |
| Lección 10 Maestro | Esquema de TaxAct en 5 secciones | Baja. Es un índice, no un guion; depende de pantallas | 8.1 |
| ITIN · complemento L6 | W-7 paso a paso, envío, plazos, renovación, errores | **Alta**. El mejor guion del lote: procedimental | 3.3 |
| Guía Completa · Preparador | Requisitos, PTIN, EFIN, EIN, certificaciones, licencias por estado | **Alta**. Tarifa PTIN y plazo EFIN desactualizados; falta AFSP | 2.1 |
| Bono Rumbo al Éxito | Mentalidad; redes sociales; Facebook Ads paso a paso; referidos; email | Baja-media. Marketing genérico, no específico de preparador. **No dice cuánto cobrar** | 8.2 (referidos, reseñas, alianzas) |
| Examen final (100) | 10 por lección, 3 opciones, aprobar con 70 % | Media. ~35 reutilizables; el resto son de definición o con distractores absurdos; sin retroalimentación | Banco de preguntas |
| Clases grabadas 2025 (video) | Requisitos iniciales · W-2 · 1098 y Anexo A · 1099-R · LLC en Anexo C · 1040-X y 9465 · Desempleo · Propiedad rentada · IRS2Go · 4 clases sin título (oct–nov 2025) | Sin transcribir. Son la fuente de los «esto es lo que pasa de verdad» | 2.1, 4.1, 5.1, 4.4, 6.1, 7.3, 4.4, v2, 7.2 |

---

## 3. Errores y desactualizaciones en el material original

Se corrigen al reescribir. Ninguna se hereda.

| Dónde | Dice | Debe decir (verificar en irs.gov antes de grabar) |
|---|---|---|
| L3 | Límite de ingreso bruto del pariente calificado «$4,700 para 2024» | 2024 fue $5,050; 2025 $5,200; el de 2026 sale de `cifras` |
| L4 | Cabeza de familia 2024: $21,500 | 2024 fue $21,900. Para 2026: $24,150 |
| L4 | CTC $2,000 / reembolsable $1,600 | Desde 2025 (OBBBA): $2,200 / hasta $1,700 (indexado) |
| L4 | SALT máximo $10,000 | 2026: $40,400 con reducción a partir de ~$505,000 de AGI |
| L7 | «El EITC se reclama en el Anexo 3» | El EITC va en la 1040 (línea 27) con el Anexo EIC; el Anexo 3 es para otros créditos |
| L7 | «No puedes presentar como casado por separado» para EITC | Desde 2021 sí, si vivió separado del cónyuge los últimos 6 meses o tiene acuerdo de separación |
| L8 | 1099-MISC/NEC «si el total es $600 o más» | Pagos hechos en 2026 en adelante: $2,000 (indexado después) |
| L8 | No menciona 1099-K | 1099-K: $20,000 y 200 transacciones (restaurado por OBBBA); central para la audiencia de apps |
| Guía | Tarifa PTIN «$30–35» | Actual: ~$19.75 (verificar la del ciclo 2027) |
| Guía | EFIN «4 a 6 semanas» | El IRS pide contar 45 días |
| Guía | No menciona AFSP | Annual Filing Season Program: 18 h de educación continua con AFTR de 6 h; da derecho limitado de representación |
| ITIN | Renovación por dígitos medios 70–88, 90–99 | Esa regla ya corrió; hoy aplica sobre todo «no usado en 3 años consecutivos» |
| Examen L7 q10 / L10 q7 | Pregunta duplicada sobre e-file | Eliminar una |
| Todo el material | Nada sobre las deducciones nuevas de OBBBA: propinas (hasta $25,000), horas extra ($12,500 / $25,000), mayores de 65 ($6,000), donaciones sin detallar ($1,000 / $2,000 desde 2026) | Entran en 4.1, 4.3, 4.4, 5.1 como `cifra_concept` |
| Todo el material | Nada sobre 8867 / debida diligencia | Lección 5.4 nueva |
| Todo el material | Nada sobre la entrevista al cliente | Lección 2.3 nueva |
| Todo el material | Nada sobre el plan de seguridad escrito (WISP) que el IRS exige a todo preparador con PTIN | Entra en 8.3 |

---

## 4. Cambios respecto al diseño original de 8 módulos

- **Módulos reordenados:** 1 Fundamentos · 2 Tu registro · **3 Familia** · **4 Ingresos** · **5 Deducciones y créditos** · **6 Anexo C** · 7 Errores y cartas · 8 Tu primera temporada. (El diseño tenía Ingresos–Deducciones–Anexo C–Familia.)
- **Nuevas:** 2.3 La entrevista con el cliente · 5.4 Debida diligencia (8867) · 6.2 Gastos · 6.3 Millas · 6.4 Oficina en casa · 7.2 Cartas del IRS.
- **Recuperadas del curso viejo que el diseño había dejado fuera:** 3.3 ITIN y W-7 · 4.4 Desempleo, Seguro Social y pensiones · 5.5 el 1095-A · 7.3 la 1040-X y el plan de pagos 9465.
- **Fuera de v1** (ver §7): Anexo E (renta), Anexo D e inversiones, Anexo B, declaraciones estatales, LLC/S-corp, pista en inglés.
- **Conteo:** 30 lecciones. Landing, certificado y árbol dicen «30 lecciones» (no 25).

---

## 5. Los 8 módulos y 30 lecciones

Leyenda de estado: **existe** = hay guion que se reescribe · **parcial** = hay material pero incompleto · **nuevo** = se escribe desde cero con Liliana. Duración = minutos objetivo de video. Segmentos = esqueleto propuesto; Liliana lo corrige.

### Módulo 1 · Fundamentos del sistema fiscal
*Al terminar: el alumno explica con sus palabras cómo se llega de un ingreso a un reembolso, y cuándo es la temporada.*

**1.1 Preparador, contribuyente e IRS: quién es quién** — existe (L1) · 7 min
Segmentos: (1) Soy Liliana, más de 20 años preparando declaraciones y un tiempo dentro del IRS: qué vas a poder hacer al terminar el curso. (2) Qué es una declaración y por qué existe. (3) El contribuyente: sus tres obligaciones (declarar todo, a tiempo, pagar). (4) El preparador: lo que asumes cuando firmas. (5) El IRS: qué hace y qué no hace (no da miedo cuando lo conoces). (6) «Esto es lo que pasa de verdad»: cómo se ve una declaración desde adentro del IRS.
Cifras: ninguna. Práctica: no. Notas: quitar el intro y el cierre de 4 párrafos; la lección 1 no lleva la historia del Tío Sam.

**1.2 Cómo funciona el impuesto sobre la renta** — existe (L2, L6) · 10 min · *la lección conceptual más importante del curso*
Segmentos: (1) El río: ingreso total → ajustes → AGI. (2) AGI → deducción (estándar o detallada) → ingreso tributable. (3) Tramos progresivos: solo el dinero que cruza la línea paga la tasa alta (el mito del «me subieron de tramo»). (4) Impuesto → créditos no reembolsables → impuestos adicionales. (5) Pagos: retenciones, estimados, créditos reembolsables → reembolso o saldo. (6) El caso completo de una alumna (W-2 + un hijo) siguiendo el río. (7) Dónde vive cada paso en la 1040 (anexos 1, 2, 3 nombrados una vez).
Cifras: `tramos`, `deduccion_estandar`. Práctica: no. Notas: la anécdota del Tío Sam cabe en 20 segundos o se quita; el ejemplo «20 % plano» de la L2 se reemplaza por tramos reales desde `cifras`.

**1.3 Los impuestos que verás en una 1040** — existe (L5) · 7 min
Segmentos: (1) Federal sobre la renta. (2) Estatal: cuáles estados no tienen (Texas entre ellos). (3) Seguro Social y Medicare: el empleado paga la mitad, el empleador la otra. (4) Trabajo por cuenta propia: el independiente paga las dos mitades (por qué le sale «tanto»). (5) Lo que no va en la 1040: ventas, propiedad. (6) Quién está obligado a declarar y quién conviene que declare aunque no esté obligado.
Cifras: `umbral_declarar`, `umbral_se_400`, `tasa_fica`, `tasa_se`. Práctica: no.

**1.4 El calendario de la temporada** — parcial (L9, L1) · 5 min
Segmentos: (1) 31 de enero: llegan W-2 y 1099; antes no se puede cerrar nada. (2) Cuándo abre el e-file y cuándo el IRS suelta reembolsos con EITC/ACTC (retención por ley hasta mediados de febrero). (3) 15 de abril; extensión con 4868 hasta octubre — extiende presentar, no pagar. (4) Pagos estimados trimestrales. (5) Tres años para reclamar un reembolso. (6) Cómo se ve la semana de un preparador en febrero.
Cifras: `fechas_temporada`. Práctica: no.

### Módulo 2 · Tu registro como preparador
*Al terminar: el alumno tiene PTIN, sabe qué firma, y sabe qué preguntar antes de tocar un formulario.*

**2.1 PTIN, EFIN y licencias: cómo te registras** — parcial (Guía; clase en vivo «Requisitos iniciales») · 9 min
Segmentos: (1) PTIN: quién lo necesita (todo el que cobra), cómo se saca hoy en irs.gov, cuánto cuesta, se renueva cada año en octubre–diciembre. (2) EFIN: solo si vas a transmitir tú; verificación de antecedentes; cuenta con 45 días; alternativa: transmitir a través de otro. (3) AFSP: el programa voluntario que te da un certificado del IRS y derecho limitado a representar. (4) Estados con licencia propia: CA, OR, MD, NY, CT; Texas no la exige. (5) EIN y negocio: cuándo te conviene. (6) Lo que pasa de verdad: el preparador que trabaja sin PTIN.
Cifras: `tarifa_ptin`, `plazo_efin`. Práctica: no. Notas: es la lección más «haz esto ahora»; termina con la tarea «saca tu PTIN esta semana».

**2.2 Ética y responsabilidad: lo que asumes al firmar** — existe (L1, L9) · 8 min
Segmentos: (1) Firmas con tu nombre y tu PTIN en cada declaración; el «preparador fantasma» que no firma. (2) Circular 230 en lenguaje de casa: competencia, diligencia, no engañar, no prometer. (3) El precio se fija por el trabajo, nunca como porcentaje del reembolso; el reembolso nunca pasa por tu cuenta. (4) Confidencialidad y qué guardas (copia de la declaración y lista de clientes, 3 años). (5) Sanciones por preparador: existen, por declaración, se dicen sin drama. (6) El cliente que te pide «ayudarle un poquito»: cómo dices que no.
Cifras: `sancion_6694`, `sancion_6695`. Práctica: no.

**2.3 La entrevista con el cliente (intake)** — **nuevo** · 11 min · *la lección que faltaba; base de todas las prácticas de casos*
Segmentos: (1) Antes de abrir el software: los 10 minutos que evitan el 80 % de los errores. (2) Identidad: ID vigente, tarjetas de Seguro Social o cartas de ITIN de todos los que van en la declaración, declaración del año pasado. (3) La casa: quién vivió contigo y cuántos meses; estado civil al 31 de diciembre; quién más podría reclamar a ese niño. (4) El dinero: W-2, 1099, apps, efectivo, propinas, desempleo, Seguro Social, pensiones; «¿te llegó algo que no me estás trayendo?». (5) Lo que baja el impuesto: 1095-A, 1098-T, guardería (nombre y EIN del proveedor), 1098 hipoteca, pagos estimados, carta del IP PIN. (6) Preguntas que detectan lo que el cliente no dice: «¿vendiste algo?», «¿te llegó carta del IRS?», «¿trabajaste en otro estado?». (7) Cierre: cuenta bancaria para depósito, firma del 8879, cómo lo despides sabiendo qué le falta.
Cifras: ninguna. Práctica: **PDF descargable «Lo que le pides a tu cliente»** (lista de verificación). Notas: Liliana aporta sus preguntas reales; esta lección se graba después de entrevistarla.

### Módulo 3 · Familia: estado civil y dependientes
*Al terminar: el alumno elige el estado civil correcto y sabe quién sí y quién no es dependiente, incluidos los casos de la comunidad (padres en México, hijos con ITIN).*

**3.1 Los cinco estados civiles** — existe (L3) · 10 min · **lección piloto** (revisada 22 sept con notas de Liliana)
Segmentos: (1) El estado civil se decide por el 31 de diciembre. (2) Soltero; casado conjunto; casado separado: qué se pierde al presentar separado. (3) Cabeza de familia: los tres requisitos (no casado o «considerado no casado», más de la mitad del costo de la casa, persona calificada más de medio año). (4) Viudo con hijo: dos años con tasas de casado. (5) Los tres errores que más vi: soltera con hijos que califica para cabeza de familia; casado viviendo con su esposa marcando cabeza de familia; separada sin divorcio marcando soltera. (6) Caso: Marisol, separada desde marzo, dos hijos, paga la renta — ¿qué marca?
Cifras: `deduccion_estandar` por estado. Práctica: **Práctica del módulo 3 «Elige el estado civil y los dependientes»** (tres casos con documentos).

**3.2 Quién es dependiente** — existe (L3) · 11 min
Segmentos: (1) Dos tipos: hijo calificado y pariente calificado; nunca los dos a la vez. (2) Hijo calificado: relación, edad (<19, <24 estudiante, cualquier edad con discapacidad), residencia más de medio año, sustento, no presenta conjunta. (3) Pariente calificado: no es hijo calificado de nadie, relación o vive todo el año, ingreso bruto bajo el límite, tú das más de la mitad del sustento. (4) La prueba de ciudadanía o residencia: EE. UU., Canadá o México — los padres en México pueden ser dependientes si cumplen sustento y tienen ITIN. (5) Cuando dos personas reclaman al mismo niño: reglas de desempate; padres divorciados y el Formulario 8332. (6) Qué necesitas de cada dependiente: nombre exacto, SSN o ITIN, relación, meses en casa. (7) Lo que pasa de verdad: el niño reclamado dos veces y el rechazo del e-file.
Cifras: `ingreso_bruto_pariente`. Práctica: módulo 3.

**3.3 ITIN y el Formulario W-7** — existe (complemento ITIN, L6) · 9 min
Segmentos: (1) Qué es el ITIN, quién lo necesita, qué no da (no autoriza trabajar, no da Seguro Social). (2) Lo que sí y lo que no se puede reclamar con ITIN: sin EITC para quien tenga ITIN; hijos con ITIN reciben el crédito por otros dependientes, no el CTC. (3) El W-7 paso a paso: datos, razón, documentos (pasaporte resuelve identidad y estatus). (4) Se presenta junto con la declaración: por correo a Austin, en un TAC o con un Agente de Aceptación Certificado. (5) Tiempos y renovación: 7–11 semanas; caduca si no se usa tres años seguidos. (6) Errores: sin declaración adjunta, documentos sin traducción certificada, nombres que no coinciden.
Cifras: `plazo_itin`. Práctica: no. Notas: quitar la regla vieja de dígitos medios; confirmar si Liliana es CAA (cambia el guion).

### Módulo 4 · Ingresos: W-2, 1099 y efectivo
*Al terminar: el alumno pasa cualquier documento de ingreso a la línea correcta de la 1040 y sabe que todo ingreso se reporta, llegue o no formulario.*

**4.1 Leer un W-2 sin errores** — parcial (L8; clase en vivo «W-2») · 10 min
Segmentos: (1) Casilla 1 vs casilla 3 y 5: por qué no coinciden (401k). (2) Casillas 2, 4, 6: lo retenido; la 2 es la que más se equivoca al teclear. (3) Casilla 12 y sus códigos que importan (D, DD, W). (4) Casilla 13 «plan de retiro» y por qué afecta el IRA. (5) Casilla 14 y las nuevas deducciones de propinas y horas extra: dónde las reporta el empleador. (6) 15–17 estatal: lo que se olvida. (7) Varios W-2, W-2 corregido, y qué hacer si el cliente no lo recibió (4852).
Cifras: `deduccion_propinas`, `deduccion_horas_extra`. Práctica: **Práctica del módulo 4 «Del W-2 a la 1040»** (transcribir casillas a líneas).

**4.2 Los distintos 1099** — existe (L8; clase «1099-R» para la R) · 9 min
Segmentos: (1) La regla que no cambia: el umbral es del pagador; el cliente reporta todo. (2) 1099-NEC: contratista → Anexo C. (3) 1099-K: apps y plataformas; el monto es bruto (incluye comisiones y reembolsos); no duplicar con el NEC. (4) 1099-MISC: renta, premios. (5) 1099-INT y DIV: a la 1040 directo; Anexo B solo si pasan el límite. (6) Un cuadro: formulario → línea. (7) Lo que pasa de verdad: el CP2000 por un 1099 «que nunca llegó».
Cifras: `umbral_1099_nec`, `umbral_1099_k`, `umbral_anexo_b`. Práctica: módulo 4.

**4.3 Ingresos sin formulario: efectivo, propinas y apps** — parcial (L5) · 8 min
Segmentos: (1) El cliente que dice «no me dieron papel». (2) Efectivo y trabajos por fuera: dónde van (Anexo C si es actividad, línea 8 si es esporádico). (3) Propinas: reportadas al empleador, asignadas (casilla 8), no reportadas (4137). (4) La nueva deducción por propinas: quién califica, qué es «propina calificada», límite. (5) Apps bajo el umbral del 1099-K: igual se reporta. (6) Cómo le explicas al cliente que reportar le conviene (préstamos, Seguro Social, EITC necesita ingreso del trabajo).
Cifras: `deduccion_propinas`. Práctica: no.

**4.4 Desempleo, Seguro Social y pensiones** — existe (L5; clases «Desempleo y otras formas», «1099-R») · 9 min
Segmentos: (1) 1099-G: desempleo es tributable federal; reembolso estatal solo si detalló el año anterior. (2) SSA-1099: hasta el 85 % puede ser tributable según el ingreso provisional; la nueva deducción para mayores de 65. (3) 1099-R: la casilla 7 y sus códigos (1, 2, 7, G); retiro anticipado y la multa del 10 % (5329). (4) Rollover vs distribución. (5) Cuándo conviene que un jubilado declare aunque no esté obligado. (6) Caso: don Ramón, Seguro Social + pensión pequeña.
Cifras: `deduccion_mayores_65`, `base_ss_tributable`. Práctica: no.

### Módulo 5 · Deducciones y créditos
*Al terminar: el alumno decide estándar vs detallada, califica correctamente EITC y CTC, y documenta la debida diligencia sin que le tiemble la mano.*

**5.1 Deducción estándar vs. detallada** — existe (L4; clase «1098 y Anexo A») · 10 min
Segmentos: (1) La estándar por estado civil; extra por 65+ o ceguera; límite para quien es dependiente. (2) Cuándo gana detallar: la suma del Anexo A contra la estándar. (3) Anexo A línea por línea: médicos sobre 7.5 % del AGI; impuestos estatales y de propiedad con tope; intereses de hipoteca (1098) y su límite; donaciones y el nuevo piso del 0.5 %. (4) La donación sin detallar (nueva desde 2026). (5) Lo que ya no se deduce (gastos de empleado, preparación de impuestos). (6) Caso: pareja con casa en Houston — ¿detallan o no?
Cifras: `deduccion_estandar`, `adicional_65_ceguera`, `tope_salt`, `piso_medico`, `limite_hipoteca`, `donacion_sin_detallar`. Práctica: no.

**5.2 Crédito por ingreso del trabajo (EITC)** — existe (L4, L7) · 11 min
Segmentos: (1) Qué es y por qué es el crédito más grande y más revisado. (2) Requisitos del contribuyente: ingreso del trabajo, SSN válido para todos (sin ITIN), residente más de medio año, no casado por separado salvo la excepción de separación. (3) Sin hijos: edad 25–64. (4) Hijo calificado para EITC: relación, edad, residencia — y más joven que el contribuyente. (5) Límite de ingreso de inversión. (6) Cómo se calcula (tabla, no fórmula) y la retención del reembolso hasta febrero. (7) Lo que pasa de verdad: por qué el IRS audita este crédito y qué le piden al cliente.
Cifras: `eitc_max`, `eitc_limite_agi`, `eitc_limite_inversion`. Práctica: **Práctica del módulo 5 «¿Califica para el EITC?»** (árbol de decisión con cuatro familias).

**5.3 Crédito por hijos y por otros dependientes** — existe (L4) · 8 min
Segmentos: (1) CTC: hijo menor de 17 con SSN; monto por hijo. (2) La parte reembolsable (ACTC): necesita ingreso del trabajo; cómo se calcula. (3) Crédito por otros dependientes: hijos de 17+, padres, hijos con ITIN. (4) Reducción por ingreso alto. (5) Anexo 8812. (6) Caso: familia con tres hijos, uno con ITIN.
Cifras: `ctc_monto`, `actc_max`, `odc_monto`, `ctc_phaseout`, `actc_ingreso_minimo`. Práctica: módulo 5.

**5.4 Debida diligencia: el Formulario 8867** — **nuevo** · 9 min
Segmentos: (1) Cuatro beneficios que lo exigen: EITC, CTC/ACTC/ODC, AOTC y cabeza de familia. (2) El requisito de conocimiento: no basta con lo que dice el cliente si algo no cuadra. (3) Qué preguntas, qué documentos viste, qué anotaste — y guardarlo tres años. (4) La multa es por beneficio, por declaración; se dice el número sin drama. (5) Los fallos típicos: no preguntar por el otro padre, no preguntar meses en casa, aceptar «vive conmigo» sin más. (6) Cómo se ve un expediente que sobrevive una visita del IRS.
Cifras: `sancion_8867`. Práctica: módulo 5 (cada caso pide marcar qué documentarías).

**5.5 Otros créditos que verás: educación, guardería y el seguro del Marketplace** — existe (L4, L6) · 10 min
Segmentos: (1) AOTC: cuatro años, medio tiempo, 1098-T, parte reembolsable; LLC: el resto. Formulario 8863. (2) Crédito por cuidado de hijos: gastos con tope, porcentaje, el proveedor tiene que tener EIN o SSN; Formulario 2441. (3) 1095-A: si el cliente tuvo seguro del Marketplace hay que reconciliar el subsidio en el 8962; puede devolver. (4) El rechazo de e-file más común de la temporada: 1095-A sin 8962. (5) Caso: madre con hijo en la universidad y guardería del pequeño.
Cifras: `aotc_max`, `llc_max`, `cuidado_tope`, `cuidado_porcentaje`. Práctica: no.

### Módulo 6 · Trabajo independiente: Anexo C
*Al terminar: el alumno llena un Anexo C real de un repartidor de apps casilla por casilla y calcula el impuesto por cuenta propia.*

**6.1 Quién presenta Anexo C y cómo se lee** — existe (L7; clase «LLC en la 1040 Schedule C») · 8 min
Segmentos: (1) Quién: contratista, repartidor, negocio de una persona, LLC de un solo dueño. (2) Negocio vs pasatiempo. (3) Parte I: ingresos brutos = NEC + K + efectivo; devoluciones; costo de mercancía solo si hay inventario. (4) Parte II: la lista de gastos, una por línea. (5) Ganancia neta → Anexo 1 → 1040; y de ahí al Anexo SE. (6) El código de actividad y el método de contabilidad (efectivo casi siempre).
Cifras: ninguna. Práctica: **Práctica del módulo 6 «Anexo C · Rosa Delgado»** (la del diseño; ya especificada).

**6.2 Gastos que sí deduces** — **nuevo** · 10 min
Segmentos: (1) «Ordinario y necesario»: la prueba de cada gasto. (2) Línea por línea con ejemplos de repartidor y de estilista: publicidad, comisiones, seguros, intereses, honorarios, oficina, renta, reparaciones, suministros, licencias, viajes. (3) Comidas al 50 %; teléfono e internet solo el porcentaje de negocio. (4) Lo que NO va: ropa normal, el trayecto de casa al trabajo, multas, el seguro médico propio (va en el Anexo 1). (5) Recibos: qué guardar y cómo. (6) Lo que pasa de verdad: el Anexo C con más gastos que ingresos tres años seguidos.
Cifras: `porcentaje_comidas`. Práctica: módulo 6.

**6.3 Millas y vehículo** — **nuevo** · 9 min
Segmentos: (1) Dos métodos: tarifa estándar por milla vs gastos reales; si empiezas con reales, ya no puedes volver. (2) Qué cuenta como milla de negocio y qué no (el trayecto de casa no). (3) El registro: fecha, millas, propósito; el reporte de la app no siempre alcanza. (4) Estacionamiento y peajes se suman. (5) Parte IV del Anexo C: las preguntas del vehículo. (6) No confundir con la nueva deducción personal por intereses de auto (OBBBA): esa no es del Anexo C. (7) Caso: 9,120 millas de negocio — cuánto sale con la tarifa de este año.
Cifras: `tarifa_millas` (ojo: puede cambiar a mitad de año; la práctica calcula desde `cifras` por año del caso). Práctica: módulo 6.

**6.4 Oficina en casa** — **nuevo** · 7 min
Segmentos: (1) Uso exclusivo y regular: la mesa del comedor no califica. (2) Lugar principal de negocio. (3) Método simplificado: pies cuadrados por tarifa, con tope. (4) Método regular: Formulario 8829 y porcentaje de la casa. (5) No puede generar pérdida. (6) Quién casi nunca califica: el repartidor.
Cifras: `oficina_simplificada_tarifa`, `oficina_simplificada_tope`. Práctica: módulo 6.

**6.5 Impuesto por cuenta propia y pagos estimados** — parcial (L5, L7) · 8 min
Segmentos: (1) Anexo SE: 15.3 % sobre el 92.35 % de la ganancia; el $400 que obliga a declarar. (2) La mitad se deduce en el Anexo 1. (3) La deducción del 20 % de ingreso calificado (QBI): el software la calcula, tú sabes que existe. (4) Pagos estimados: cuatro fechas, 1040-ES, y el puerto seguro (100 % del año pasado). (5) La multa por no pagar durante el año. (6) Cómo le explicas al cliente independiente que «guarde el 25–30 %».
Cifras: `tasa_se`, `umbral_se_400`, `fechas_estimados`, `qbi_porcentaje`. Práctica: módulo 6 (línea final: SE).

### Módulo 7 · Errores comunes y cartas del IRS
*Al terminar: el alumno reconoce los errores antes de transmitir, lee una carta del IRS sin pánico y sabe enmendar.*

**7.1 Los errores que más veo** — existe (L9; la lista real la pone Liliana) · 8 min
Segmentos: (1) Nombre o SSN que no coincide: el rechazo antes de empezar. (2) Estado civil mal elegido. (3) Dependiente reclamado dos veces. (4) Ingreso que faltó: el 1099-K, el segundo W-2, el desempleo. (5) 1095-A sin reconciliar; retención estatal olvidada; cuenta bancaria mal escrita. (6) Firmar sin PTIN, no dar copia al cliente. (7) La lista de verificación de 60 segundos antes de transmitir.
Cifras: ninguna. Práctica: **«Encuentra el error»** (una declaración con 5 errores plantados; opcional del módulo).

**7.2 Cuando llega una carta del IRS** — **nuevo** (clase «App IRS2Go» para herramientas) · 10 min
Segmentos: (1) Lo primero: número de aviso, año fiscal, fecha para responder. Nunca se ignora; casi nunca es urgente ese día. (2) CP2000: ingreso que no coincide — cómo se responde. (3) CP11/CP12: el IRS corrigió un cálculo; CP14: saldo. (4) 5071C/4883C: verificar identidad. (5) CP75 y cartas 12C: piden documentos del EITC o el 8962. (6) Estafas: el IRS no llama ni manda textos exigiendo pago. (7) Qué puedes hacer tú y qué no: 8821 para ver información; representación limitada con AFSP; cuándo derivar a un EA. Herramientas: cuenta en línea del cliente, transcripciones, IRS2Go.
Cifras: ninguna. Práctica: no.

**7.3 Enmendar: 1040-X y el plan de pagos 9465** — existe (L6; clase «1040-X y 9465») · 8 min
Segmentos: (1) Cuándo se enmienda y cuándo no (el IRS corrige solo los errores aritméticos). (2) Tres años para un reembolso. (3) Esperar a que procesen la original; la 1040-X se transmite electrónicamente. (4) Qué cambia y por qué: las tres columnas. (5) El estado también se enmienda. (6) Si debe y no puede pagar: plan de pagos en línea o 9465; los intereses siguen. (7) Lo que pasa de verdad: el cliente que enmendó tres años seguidos.
Cifras: `plazo_reembolso_3_anos`, `plan_pagos_limites`. Práctica: no.

### Módulo 8 · Tu primera temporada
*Al terminar: el alumno tiene un flujo de trabajo, precios y un expediente que aguanta una revisión.*

**8.1 Tu software y el e-file** — existe (L10; decisión pendiente TaxAct o neutral) · 9 min
Segmentos: (1) El flujo que no cambia con el software: cliente nuevo → intake → capturar documentos → diagnósticos → revisar con el cliente → firma del 8879 → transmitir → acuse → rechazos. (2) Los diagnósticos: qué te dice el programa y qué no ve. (3) El 8879: qué es, quién firma, cuándo. (4) Rechazos comunes y cómo se resuelven (SSN, dependiente ya reclamado, 8962). (5) Copia al cliente y respaldo. (6) [Si TaxAct] recorrido de pantallas grabado, no avatar.
Cifras: ninguna. Práctica: no. Notas: si Liliana cambia de software en 2027, esta lección se regraba sola; por eso el guion es neutral y las pantallas van aparte.

**8.2 Precios, clientes y cómo cobrar** — parcial (Bono; los precios los da Liliana) · 9 min
Segmentos: (1) Cómo se cobra en este oficio: por formulario/complejidad, no por porcentaje del reembolso. (2) Rangos reales por tipo de declaración (Liliana). (3) Carta de compromiso y depósito. (4) Los productos bancarios (adelanto de reembolso): qué son, qué cobran, cuándo no. (5) Tus primeros clientes: referidos, reseñas, alianzas (seguros, notarías), promoción de temporada — lo rescatable del Bono. (6) Lo que no prometes: monto de reembolso, «te saco más», velocidad.
Cifras: ninguna en la app (los precios del alumno no son cifras fiscales). Práctica: no. Notas: el Bono de Facebook Ads se ofrece como PDF aparte, no como lección.

**8.3 Tu sistema de trabajo** — parcial (L9, Guía) · 9 min
Segmentos: (1) La carpeta de cada cliente: intake, IDs, documentos, 8867, 8879, copia de la declaración. (2) Cuánto guardas: 3 años obligatorios; 7 recomendados. (3) El plan de seguridad escrito (WISP): el IRS lo exige a todo PTIN; qué contiene en una página. (4) Tu calendario: renovar PTIN en otoño, educación continua (AFSP), recordar pagos estimados a tus independientes, la posttemporada. (5) Cuándo te actualizas y con quién. (6) Cierre del curso: «esto es lo que haces el 2 de enero».
Cifras: `retencion_registros`. Práctica: no. Notas: enlaza al certificado.

---

## 6. Prácticas interactivas

| Práctica | Módulo | Qué hace el alumno | Estado |
|---|---|---|---|
| Elige el estado civil y los dependientes | 3 | Tres casos con documentos (Marisol separada; abuela con nieto; pareja con padres en México). Marca estado civil y quién es dependiente; la app explica cada error | Nueva |
| Del W-2 a la 1040 | 4 | Transcribe un W-2 con 401k y retención estatal a las líneas de la 1040 | Nueva |
| ¿Califica para el EITC? | 5 | Árbol de decisión con cuatro familias; marca qué documentarías en el 8867 | Nueva |
| Anexo C · Rosa Delgado | 6 | La del diseño: 1099-K, millas, W-2 aparte, teléfono al 60 % | Diseñada (corregir tarifa de millas desde `cifras`) |
| Encuentra el error | 7 | Declaración con 5 errores plantados | Opcional |

Regla: las respuestas esperadas se calculan desde `cifras` con el año fiscal del caso, nunca se escriben a mano.

---

## 7. Fuera de v1 (candidatos para la fase 5)

- Renta de propiedades (Anexo E) — hay clase grabada.
- Inversiones y ganancias de capital (Anexo D, 8949) — hay material en L7.
- Anexo B e intereses del extranjero.
- Declaraciones estatales (fuera de Texas).
- LLC con socios, S-corp — pertenece al Curso Empresarial.
- Pista en inglés — después de estabilizar el español; necesita guía de voz en inglés.

---

## 8. Lo que Liliana tiene que aportar (no se puede escribir sin ella)

1. **Su lista real de errores** para 7.1 — los que ella vio en el IRS y los que ven sus alumnos.
2. **Una historia por lección** (30 en total, de 30–60 segundos): el «esto es lo que pasa de verdad». Se recogen en una o dos sesiones de grabación con preguntas guía.
3. **Sus preguntas de intake** reales (2.3) y si tiene un formulario que ya usa.
4. **Rangos de precios** por tipo de declaración (8.2).
5. **Si es Agente de Aceptación Certificado** (cambia 3.3) y si tiene AFSP.
6. **TaxAct o neutral** (8.1).
7. **Aprobación de este documento**: orden de módulos, 30 lecciones, títulos.

---

## 9. Orden de producción

1. **Piloto: 3.1 Los cinco estados civiles** — guion completo + 10 preguntas + un segmento en video. Liliana lo ve en el teléfono. Se fija el formato.
2. Módulo 1 y 2 (arrancan el curso; 2.3 requiere entrevista con Liliana).
3. Módulo 3 y 4.
4. Módulo 5 y 6 (las lecciones nuevas del 6 son las de más trabajo).
5. Módulo 7 y 8.
6. Prácticas en paralelo desde que el módulo 3 está aprobado.

Cada lección pasa por: guion en MDX → revisión de Liliana → cifras verificadas → preguntas con retroalimentación → HeyGen → Stream → QA en el reproductor.
