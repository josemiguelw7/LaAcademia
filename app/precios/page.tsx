import type { Metadata } from "next";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import { getPlans, precio, waInscripcion, type Plan } from "@/lib/plans";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Precios — Liliana Miranda · La Academia",
  description: "El mismo curso en los tres niveles. Lo que cambia es cuánto acceso tienes a Liliana.",
};

const incluye: Record<string, string[]> = {
  curso: [
    "Las 31 lecciones con video",
    "Preguntas después de cada segmento",
    "Prácticas en réplicas de los formularios reales",
    "Plan sugerido de 21 días",
    "Certificado de La Academia",
    "Acceso de por vida, con las cifras de cada año",
  ],
  soporte: [
    "Todo lo del nivel Curso",
    "Tus preguntas por WhatsApp durante la temporada de impuestos",
    "Sesiones grupales semanales en temporada",
  ],
  mentoria: [
    "Todo lo del nivel anterior",
    "WhatsApp conmigo todo el año",
    "Una llamada al mes conmigo",
    "Revisión de 3 declaraciones reales tuyas",
    "Cupo limitado a 12 personas por grupo",
  ],
};

const comparacion: [string, string, string, string][] = [
  ["Las 31 lecciones y prácticas", "●", "●", "●"],
  ["Certificado de La Academia", "●", "●", "●"],
  ["Acceso de por vida", "●", "●", "●"],
  ["Preguntas por WhatsApp", "—", "En temporada", "Todo el año"],
  ["Sesiones grupales semanales", "—", "●", "●"],
  ["Llamada al mes con Liliana", "—", "—", "●"],
  ["Revisión de declaraciones reales", "—", "—", "3"],
  ["Cupo por grupo", "Sin límite", "Sin límite", "12"],
];

const faqsPago = [
  {
    q: "¿Es un pago único o una mensualidad?",
    a: "Pago único. Pagas una vez y el curso es tuyo de por vida, con las cifras actualizadas de cada año.",
  },
  {
    q: "¿Cómo pago?",
    a: "Escríbeme por WhatsApp y te mando el enlace de pago seguro. Muy pronto podrás pagar directo desde esta página.",
  },
  {
    q: "¿Puedo cambiar de nivel después?",
    a: "Sí. Si empiezas con el Curso y luego quieres soporte o mentoría, pagas solo la diferencia.",
  },
  {
    q: "¿El precio incluye todo?",
    a: "Sí: no hay cargos escondidos ni materiales aparte. Lo único que pagas aparte, cuando llegue el momento, es tu PTIN al IRS.",
  },
];

function Card({ plan, destacado }: { plan: Plan; destacado: boolean }) {
  const items = incluye[plan.id] ?? [];
  return (
    <div className={`flex h-full flex-col rounded-tarjeta border p-7 ${destacado ? "border-2 border-bronce bg-blanco" : "border-linea bg-blanco"}`}>
      {destacado ? (
        <p className="mb-3 w-fit rounded-full bg-bronce-suave px-3 py-1 text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">
          El más elegido
        </p>
      ) : null}
      <h2 className="text-[17px] font-bold">{plan.name}</h2>
      <p className="mt-3 font-titulo text-[40px] leading-none">{precio(plan.price_cents)}</p>
      <p className="mt-2 text-[13px] text-gris-texto">Pago único · acceso de por vida</p>
      <ul className="mt-6 flex-1 space-y-3">
        {items.map((x) => (
          <li key={x} className="flex gap-3 text-[15px] leading-snug text-tinta-2">
            <span aria-hidden className="mt-[2px] text-bronce">●</span>
            {x}
          </li>
        ))}
      </ul>
      <a
        href={waInscripcion(plan.name)}
        className={`mt-8 block rounded-boton px-5 py-[15px] text-center text-[16px] font-bold ${
          plan.id === "curso" ? "bg-tinta text-blanco" : "bg-bronce text-blanco"
        }`}
      >
        Inscribirme por WhatsApp
      </a>
    </div>
  );
}

export default async function Precios() {
  const plans = await getPlans();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Precios</p>
          <h1 className="mt-3 max-w-[24ch] text-[30px] leading-[1.12] md:text-[40px]">
            El mismo curso en los tres niveles. Lo que cambia es cuánto acceso tienes a mí.
          </h1>
          <p className="mt-4 max-w-[58ch] text-[16px] text-tinta-2">
            Los tres incluyen las 31 lecciones completas, las prácticas y el certificado de La Academia.
            Elige según el acompañamiento que quieras de mi parte.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <Card plan={p} destacado={p.id === "soporte"} />
            </Reveal>
          ))}
        </div>

        {/* Comparación */}
        <Reveal>
          <div className="mt-16 overflow-x-auto rounded-tarjeta border border-linea bg-blanco">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-linea text-[12px] uppercase tracking-[.1em] text-gris-texto">
                  <th className="px-5 py-4 font-semibold">Qué incluye</th>
                  {plans.map((p) => (
                    <th key={p.id} className={`px-5 py-4 font-semibold ${p.id === "soporte" ? "text-bronce-oscuro" : ""}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparacion.map(([fila, a, b, c]) => (
                  <tr key={fila} className="border-b border-linea last:border-0">
                    <td className="px-5 py-3.5 text-tinta-2">{fila}</td>
                    <td className="px-5 py-3.5">{a === "●" ? <span className="text-bronce">●</span> : a}</td>
                    <td className="px-5 py-3.5">{b === "●" ? <span className="text-bronce">●</span> : b}</td>
                    <td className="px-5 py-3.5">{c === "●" ? <span className="text-bronce">●</span> : c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* FAQ de pago */}
        <section className="mx-auto mt-16 max-w-3xl">
          <Reveal>
            <h2 className="text-[24px] md:text-[28px]">Sobre el pago</h2>
          </Reveal>
          <div className="mt-6 space-y-3">
            {faqsPago.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="rounded-tarjeta border border-linea bg-blanco p-5 open:border-tinta">
                  <summary className="cursor-pointer list-none text-[16px] font-bold marker:content-none">{f.q}</summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
