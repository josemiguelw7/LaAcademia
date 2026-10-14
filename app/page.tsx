import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import Reveal from "@/components/marketing/Reveal";
import Motion from "@/components/marketing/Motion";
import PhoneDemo from "@/components/marketing/PhoneDemo";
import { getPlans, precio } from "@/lib/plans";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Liliana Miranda · La Academia — Aprende a preparar impuestos en español",
  description:
    "Te enseño a preparar impuestos paso a paso, con casos reales y práctica en los formularios de verdad. Certifícate con La Academia Liliana Miranda.",
};

const pasos = [
  { n: "01", t: "Mira una lección corta", d: "31 lecciones con video, pensadas para tu teléfono y tus ratos libres." },
  { n: "02", t: "Responde las preguntas", d: "Después de cada segmento te pregunto. Dominas la lección con 8 de 10." },
  { n: "03", t: "Practica en el formulario real", d: "Llenas réplicas de los formularios de verdad, casilla por casilla, con casos como los que vas a ver." },
  { n: "04", t: "Recibe tu certificado", d: "Al dominar los 8 módulos, te certificas con La Academia Liliana Miranda." },
];

const modulos = [
  ["01", "Fundamentos", "Cómo funcionan los impuestos en EE. UU. y tu papel como preparadora."],
  ["02", "Registro y ética", "Tu PTIN, tus obligaciones y la entrevista con el cliente."],
  ["03", "La familia fiscal", "Estado civil, dependientes e ITIN, sin enredos."],
  ["04", "Ingresos", "W-2, 1099 y todo lo que llega en la pila de papeles."],
  ["05", "Deducciones y créditos", "EITC, Crédito por Hijos y los que más dinero dejan sobre la mesa."],
  ["06", "El Anexo C", "El negocio propio: de los recibos de Rosa al formulario terminado."],
  ["07", "Errores y cartas del IRS", "Los errores que yo cometí y cómo responder una carta sin miedo."],
  ["08", "Tu primera temporada", "Software, precios y tus primeros clientes."],
] as const;

const testimonios = [
  {
    nombre: "Diana Monroy",
    rol: "Preparadora de impuestos",
    texto:
      "Liliana me ayudó a comprender cada detalle del proceso fiscal. Gracias a su asesoría, me siento mucho más segura y preparada.",
  },
  {
    nombre: "Dhiandra Betancourt",
    rol: "Preparadora de impuestos",
    texto:
      "El soporte constante que he recibido ha marcado la diferencia. Ahora me siento más segura para hacer crecer mi negocio y ofrecer un mejor servicio a mis clientes.",
  },
];

const faqs = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Empezamos desde cero y te llevo paso a paso, desde los conceptos básicos hasta la práctica con casos reales.",
  },
  {
    q: "¿Cuánto tiempo toma?",
    a: "A tu ritmo. Hay un plan sugerido de 21 días con unos 30 minutos al día, pero las lecciones te esperan: nada se vence.",
  },
  {
    q: "¿Qué es el certificado?",
    a: "Es el certificado de La Academia Liliana Miranda: demuestra que dominaste los 8 módulos. Para preparar declaraciones con pago también necesitas tu PTIN del IRS, y en el módulo 2 te enseño a sacarlo.",
  },
  {
    q: "¿Puedo ejercer en cualquier estado?",
    a: "El PTIN es federal. Algunos estados piden además un registro propio, y en el curso te explico cuáles y cómo funciona.",
  },
];

export default async function Home() {
  const plans = await getPlans();
  return (
    <>
      <Header />
      <Motion />
      <main>
        {/* Portada */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.1fr_.9fr] md:px-8 md:pb-24 md:pt-20">
          <div>
            <p className="hero-in hero-in-1 text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">
              La Academia · en español
            </p>
            <h1 className="hero-in hero-in-2 mt-4 text-[34px] leading-[1.1] sm:text-[44px] md:text-[56px]">
              Acceso directo a mí, en tu idioma.
            </h1>
            <p className="hero-in hero-in-3 mt-5 max-w-[48ch] text-[17px] leading-relaxed text-tinta-2">
              Te enseño a preparar impuestos paso a paso, con casos reales y práctica en los formularios
              de verdad. Estudias en tu teléfono, a tu ritmo, y yo te acompaño.
            </p>
            <div className="hero-in hero-in-4 mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/precios"
                className="rounded-boton bg-tinta px-6 py-[15px] text-[16px] font-bold text-blanco"
              >
                Ver los tres niveles
              </Link>
              <Link href="/demo" className="text-[15px] font-semibold text-bronce-oscuro underline underline-offset-4">
                Ve una clase gratis
              </Link>
              <Link href="/entrar" className="text-[15px] font-semibold text-bronce-oscuro underline underline-offset-4">
                ¿Ya tienes el curso? Entra
              </Link>
            </div>
            <p className="hero-in hero-in-4 mt-8 text-[13px] text-gris-texto">
              Más de 20 años preparando impuestos · Experiencia como Tax Examiner en el IRS · Más de 500 clientes
            </p>
          </div>
          <div className="hero-in hero-in-3 relative mx-auto w-full max-w-[380px]" data-parallax="-0.08">
            <div className="absolute inset-x-6 bottom-0 top-10 rounded-hoja bg-bronce-suave" aria-hidden />
            <Image
              src="/liliana/retrato.png"
              alt="Liliana Miranda"
              width={736}
              height={869}
              priority
              className="relative h-auto w-full"
            />
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="border-y border-linea bg-blanco">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Cómo funciona</p>
              <h2 className="mt-3 max-w-[22ch] text-[26px] leading-[1.15] md:text-[32px]">
                Así aprendes conmigo, lección por lección
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {pasos.map((p, i) => (
                <Reveal key={p.n} delay={i * 80}>
                  <div className="h-full rounded-tarjeta border border-linea bg-marfil p-6">
                    <p className="font-titulo text-[28px] text-bronce">{p.n}</p>
                    <h3 className="mt-3 text-[16px] font-bold">{p.t}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-gris-texto">{p.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mt-8 max-w-[70ch] text-[14px] text-gris-texto">
                Sin horarios y sin fechas de entrega: hay un plan sugerido de 21 días con unos 30 minutos al día,
                y tú decides qué tan rápido avanzas.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Módulos */}
        <section id="modulos" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">El curso</p>
            <h2 className="mt-3 max-w-[24ch] text-[26px] leading-[1.15] md:text-[32px]">
              8 módulos, 31 lecciones, un camino claro
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {modulos.map(([n, t, d], i) => (
              <Reveal key={n} delay={(i % 2) * 80}>
                <div className="flex h-full gap-5 rounded-tarjeta border border-linea bg-blanco p-6">
                  <p className="font-titulo text-[24px] leading-none text-bronce">{n}</p>
                  <div>
                    <h3 className="text-[16px] font-bold">{t}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-gris-texto">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Por dentro de La Academia */}
        <section id="por-dentro" className="border-y border-linea bg-blanco">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Por dentro</p>
              <h2 className="mt-3 max-w-[20ch] text-[26px] leading-[1.15] md:text-[32px]">
                Así se ve una lección por dentro
              </h2>
              <ul className="mt-7 space-y-5">
                {[
                  ["Un video corto, una pregunta", "Ves un segmento, respondes, y si fallas te explico exactamente dónde está la confusión."],
                  ["Las cifras siempre al día", "Ningún monto va grabado en el video: salen de la tabla del año, verificada contra el IRS."],
                  ["Prácticas en el formulario real", "Terminas llenando réplicas del Anexo C y la 1040, casilla por casilla, con casos como Rosa y María."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-4">
                    <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-bronce" />
                    <span>
                      <span className="block text-[16px] font-bold">{t}</span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-gris-texto">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[14px] text-gris-texto">
                ¿Ya eres alumna? <a href="/entrar" className="font-semibold text-bronce-oscuro underline underline-offset-4">Entra a tu curso aquí</a>.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <PhoneDemo />
            </Reveal>
          </div>
        </section>

        {/* Sobre Liliana */}
        <section className="bg-tinta text-blanco">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce">Sobre Liliana</p>
              <blockquote data-scrub-clip className="mt-6 max-w-[26ch] font-titulo text-[26px] leading-[1.25] md:text-[36px]">
                «No enseño desde un libro. Enseño desde la experiencia.»
              </blockquote>
              <p className="mt-6 max-w-[60ch] text-[16px] leading-relaxed text-blanco/80">
                Llevo más de 20 años preparando impuestos para familias y negocios en Estados Unidos, y trabajé
                dentro del IRS como Tax Examiner. Todo lo que vas a aprender conmigo viene de ahí: de los casos
                de verdad, de los errores que yo misma cometí y de lo que les pasa a mis clientes cada temporada.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Testimonios</p>
            <h2 className="mt-3 max-w-[24ch] text-[26px] leading-[1.15] md:text-[32px]">
              Alumnas que ya recorrieron este camino
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {testimonios.map((t, i) => (
              <Reveal key={t.nombre} delay={i * 80}>
                <figure className="h-full rounded-tarjeta border border-linea bg-blanco p-7">
                  <blockquote className="text-[16px] leading-relaxed text-tinta-2">«{t.texto}»</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bronce-suave font-titulo text-[18px] text-bronce-oscuro">
                      {t.nombre[0]}
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold">{t.nombre}</span>
                      <span className="block text-[13px] text-gris-texto">{t.rol}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Precios resumen */}
        <section className="border-y border-linea bg-blanco">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Los tres niveles</p>
              <h2 className="mt-3 max-w-[26ch] text-[26px] leading-[1.15] md:text-[32px]">
                El mismo curso en los tres. Lo que cambia es cuánto acceso tienes a mí.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {plans.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <div className={`h-full rounded-tarjeta border p-7 ${p.id === "soporte" ? "border-2 border-bronce bg-bronce-suave" : "border-linea bg-marfil"}`}>
                    <h3 className="text-[16px] font-bold">{p.name}</h3>
                    <p className="mt-3 font-titulo text-[34px]">{precio(p.price_cents)}</p>
                    <p className="mt-1 text-[13px] text-gris-texto">Pago único · acceso de por vida</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={160}>
              <Link href="/precios" className="mt-8 inline-block rounded-boton bg-tinta px-6 py-[15px] text-[16px] font-bold text-blanco">
                Comparar los tres niveles
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce-oscuro">Preguntas frecuentes</p>
            <h2 className="mt-3 text-[26px] leading-[1.15] md:text-[32px]">Antes de empezar</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-tarjeta border border-linea bg-blanco p-5 open:border-tinta">
                  <summary className="cursor-pointer list-none text-[16px] font-bold marker:content-none">
                    {f.q}
                  </summary>
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
