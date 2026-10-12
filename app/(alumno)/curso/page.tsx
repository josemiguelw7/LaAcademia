import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { getCourseTree } from "@/lib/course";
import { LessonNode } from "../LessonNode";

export const metadata = { title: "El curso · La Academia" };
const PRACTICES: Record<number, { code: string; title: string }> = { 6: { code: "06-anexo-c-rosa", title: "arma el Anexo C de Rosa" } };
const LABEL = { dominada: "Dominada", en_progreso: "En progreso", disponible: "Disponible", bloqueada: "Bloqueada" } as const;

export default async function Curso() {
  const v = await requireViewer();
  const tree = await getCourseTree(v.id, v.isStaff);
  return (
    <main className="px-5 pt-8 sm:px-8">
      <h1 className="text-[26px] leading-tight sm:text-[32px]">El curso</h1>
      <p className="mt-2 text-[15px] text-tinta-2">Cada lección se abre cuando dominas la anterior: 8 de 10.</p>
      {tree.map((m) => {
        const done = m.lessons.filter((l) => l.status === "dominada").length;
        return (
          <section key={m.position} className="mt-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[20px]">Módulo {m.position} · {m.title}</h2>
              <span className="text-[13px] font-semibold text-gris-texto cifras">{done}/{m.lessons.length}</span>
            </div>
            <ul className="mt-3 overflow-hidden rounded-tarjeta border border-linea bg-blanco">
              {m.lessons.map((l, i) => {
                const locked = l.status === "bloqueada";
                const row = (
                  <div className={`flex items-center gap-3.5 px-4 py-3.5 ${i ? "border-t border-linea" : ""} ${locked ? "" : "hover:bg-marfil"}`}>
                    <LessonNode status={l.status} n={`${l.module}.${l.position}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-[15px] font-semibold ${locked ? "text-gris-texto" : "text-tinta"}`}>{l.title}</p>
                      <p className="text-[13px] text-gris-texto">{l.minutes} min · {LABEL[l.status]}{l.bestScore != null && l.status !== "dominada" ? ` · mejor: ${l.bestScore}/10` : ""}</p>
                    </div>
                  </div>
                );
                return <li key={l.id}>{locked ? row : <Link href={`/leccion/${l.code}`}>{row}</Link>}</li>;
              })}
            </ul>
            {PRACTICES[m.position] && (done === m.lessons.length || v.isStaff
              ? <Link href={`/practica/${PRACTICES[m.position].code}`} className="mt-3 flex items-center justify-between rounded-tarjeta border border-bronce bg-bronce-suave px-4 py-3.5"><span className="text-[15px] font-semibold">Práctica: {PRACTICES[m.position].title}</span><span className="text-[14px] font-semibold text-bronce-oscuro">Abrir</span></Link>
              : <p className="mt-3 rounded-tarjeta border border-linea px-4 py-3.5 text-[14px] text-gris-texto">Práctica del módulo: {PRACTICES[m.position].title}. Se abre al dominar todas las lecciones.</p>)}
          </section>
        );
      })}
    </main>
  );
}
