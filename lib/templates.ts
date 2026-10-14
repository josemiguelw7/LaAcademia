/**
 * Plantillas para el negocio del graduado. Texto para aprobación de Liliana; el plan de seguridad y la
 * carta conviene que cada graduado los revise con su propio asesor. Sin cifras fijas ni promesas de ingreso.
 */
export type Template = { slug: string; title: string; intro: string; body: string };

export const TEMPLATES: Template[] = [
  {
    slug: "plan-de-seguridad",
    title: "Plan escrito de seguridad",
    intro: "La ley pide a cada preparadora un plan escrito para proteger los datos de sus clientes. Llena los espacios entre corchetes, imprímelo, fírmalo y revísalo una vez al año.",
    body: `# Plan escrito de seguridad de la información

**Negocio:** [nombre de tu negocio]
**Responsable del plan:** [tu nombre]
**Fecha:** [fecha] · **Próxima revisión:** [fecha, un año después]

## 1. Quién responde
Yo, [tu nombre], soy la responsable de este plan y de que se cumpla.

## 2. Qué información protejo
Nombres, números de Seguro Social e ITIN, fechas de nacimiento, ingresos, cuentas de banco, declaraciones y los documentos de mis clientes, en papel y en digital.

## 3. Dónde vive esa información
- Software de impuestos: [TaxAct Professional]
- Documentos de clientes: [La Academia, cifrados]
- Correo: [proveedor]
- Papel: [dónde guardas lo impreso]
- Computadoras y teléfonos: [cuáles]

## 4. Riesgos que identifiqué
[Ejemplos: robo o pérdida del teléfono o la computadora, correos falsos que piden contraseñas, alguien que ve papeles en mi escritorio, documentos mandados por correo sin protección.]

## 5. Cómo la protejo
- Uso contraseñas largas y distintas, y verificación en dos pasos en el software de impuestos, el correo y La Academia.
- Mi computadora y mi teléfono tienen bloqueo de pantalla y el disco cifrado.
- No pido ni mando documentos con Seguro Social por correo normal ni por mensajes: uso el enlace seguro.
- Solo yo, y quien yo autorice por escrito, entra a la información de clientes.
- Instalo las actualizaciones del sistema y del software en cuanto salen.
- Guardo el papel bajo llave y lo destruyo con trituradora cuando ya no lo necesito.
- Pido el permiso por escrito de mi cliente antes de compartir su información.

## 6. Proveedores
Antes de usar un servicio que guarde datos de clientes, reviso que los proteja. Hoy uso: [lista de proveedores].

## 7. Capacitación
Si alguien me ayuda, le explico este plan antes de darle acceso, y le quito el acceso el día que deje de ayudarme.

## 8. Si algo pasa
Si sospecho que alguien entró a datos de mis clientes:
1. Cambio contraseñas y desconecto el equipo afectado.
2. Aviso al IRS por medio de su enlace con preparadores (Stakeholder Liaison) de mi zona.
3. Aviso a mis clientes afectados y a las autoridades de mi estado según su ley.
4. Anoto qué pasó, cuándo y qué hice.

## 9. Revisión
Reviso este plan cada año antes de la temporada, y cada vez que cambio de equipo o de proveedor.

Firma: ______________________ Fecha: __________`,
  },
  {
    slug: "carta-de-compromiso",
    title: "Carta de compromiso con el cliente",
    intro: "Deja por escrito qué haces, qué le toca a tu cliente y cuánto cuesta. Se firma antes de empezar.",
    body: `# Carta de compromiso

**Preparadora:** [tu nombre] · [nombre de tu negocio] · PTIN [tu PTIN]
**Cliente:** [nombre del cliente]
**Año fiscal:** [año]

## Lo que voy a hacer
Preparar tu declaración federal de impuestos [y la de tu estado] del año [año], con la información y los documentos que me entregues, y enviarla de forma electrónica con tu autorización firmada.

## Lo que te toca a ti
- Darme información completa y verdadera, con todos tus formularios (W-2, 1099 y demás).
- Avisarme de cualquier ingreso, aunque no te haya llegado formulario.
- Revisar la declaración antes de firmarla. Al firmar, confirmas que es correcta.
- Guardar tus documentos y una copia de tu declaración por lo menos tres años.

## Lo que no incluye
Contestar cartas del IRS, auditorías o declaraciones de años anteriores. Si lo necesitas, lo platicamos aparte.

## Revisión
Antes de enviar tu declaración, la revisa una preparadora con más experiencia, con tu permiso por escrito.

## Costo
[Precio o cómo se calcula]. Se paga [cuándo y cómo]. El costo no depende del reembolso que recibas.

## Firmas
Cliente: ______________________ Fecha: __________
Preparadora: ______________________ Fecha: __________`,
  },
  {
    slug: "guia-de-precios",
    title: "Cómo poner tus precios",
    intro: "No hay un precio correcto para todo el país. Esto es cómo lo pienso yo para que el tuyo sea justo para ti y claro para tu cliente.",
    body: `# Cómo poner tus precios

## 1. Cobra por lo que la declaración pide, no por el cliente
Haz una lista de lo que suele llevar una declaración: la básica con W-2, cada formulario adicional, el Anexo C de un negocio, la declaración del estado. A cada cosa ponle un precio. Así una declaración sencilla cuesta menos que una con negocio propio, y tu cliente entiende por qué.

## 2. Mide tu tiempo
En tus primeras declaraciones anota cuánto tardas en cada tipo. Con eso sabes cuánto vale tu hora y si un precio te alcanza.

## 3. Mira tu zona
Pregunta cuánto cobran otras oficinas cerca de ti por una declaración sencilla y por una con negocio. No tienes que ser la más barata: tu valor es explicar en el idioma de tu cliente.

## 4. Escríbelo y enséñalo antes
Ten tu lista de precios por escrito. Dile a tu cliente cuánto va a costar antes de empezar, y ponlo en la carta de compromiso.

## 5. Nunca un porcentaje del reembolso
Tu precio no puede depender del tamaño del reembolso. Cobra por tu trabajo.

## 6. Cobra antes de enviar
Acuerda cuándo se paga. Lo más claro es cobrar cuando el cliente revisa y firma, antes de que tú envíes.

## 7. Revisa cada temporada
Al cerrar la temporada mira qué declaraciones te tomaron más de lo que cobraste, y ajusta.`,
  },
];

export const findTemplate = (slug: string) => TEMPLATES.find((t) => t.slug === slug) ?? null;
