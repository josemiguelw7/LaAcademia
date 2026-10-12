import Link from "next/link";
import Image from "next/image";
import { getLessons, MODULE_TITLES } from "@/lib/content";
import { StatusPill } from "./StatusPill";

export default function Revision() {
  const lessons = getLessons();
  const review = lessons.filter((l) => l.status === "review");
  const approved = lessons.filter((l) => l.status === "approved").length;
  const modules = [...new Set(lessons.map((l) => l.module))];
  return (
    <main>
      <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={160} height={44} className="h-auto w-[150px]" />
      <h1 className="mt-8 text-[26px] leading-tight sm:text-[32px]">Tus guiones</h1>
      <p className="mt-2 text-[15px] text-tinta-2">
        {lessons.length} lecciones. {approved} aprobadas, {review.length} esperan tu vistazo.
      </p>

      {review.length > 0 && (
        <section className="mt-6 rounded-tarjeta border border-bronce bg-bronce-suave p-5">
          <h2 className="font-cuerpo text-[16px] font-bold">Para tu revisión</h2>
          <p className="mt-1 text-[14px] text-tinta-2">Integré tus aportes en estas. Léelas y dime si tus palabras quedaron bien.</p>
          <ul className="mt-3 space-y-1">
            {review.map((l) => (
              <li key={l.id}><Link className="text-[15px] font-semibold text-bronce-oscuro underline underline-offset-4" href={`/revision/${l.id}`}>{l.module}.{l.lesson} · {l.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      {modules.map((m) => (
        <section key={m} className="mt-8">
          <h2 className="text-[20px]">Módulo {m} · {MODULE_TITLES[m]}</h2>
          <ul className="mt-3 divide-y divide-linea overflow-hidden rounded-tarjeta border border-linea bg-blanco">
            {lessons.filter((l) => l.module === m).map((l) => (
              <li key={l.id}>
                <Link href={`/revision/${l.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-marfil">
                  <span className="w-8 shrink-0 text-[13px] font-semibold text-gris-texto cifras">{l.module}.{l.lesson}</span>
                  <span className="flex-1 text-[15px] font-medium">{l.title}</span>
                  <StatusPill status={l.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
