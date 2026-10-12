import Link from "next/link";
import { notFound } from "next/navigation";
import { getLesson, getLessons, MODULE_TITLES } from "@/lib/content";
import { StatusPill } from "../StatusPill";

export function generateStaticParams() {
  return getLessons().map((l) => ({ id: l.id }));
}

export default async function LessonReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = getLesson(id);
  if (!l) notFound();
  return (
    <main>
      <Link href="/revision" className="text-[14px] font-semibold text-bronce-oscuro">← Todas las lecciones</Link>
      <p className="mt-6 text-[13px] font-semibold text-gris-texto">Módulo {l.module} · {MODULE_TITLES[l.module]} · Lección {l.lesson} · {l.duration_min} min</p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h1 className="text-[26px] leading-tight sm:text-[32px]">{l.title}</h1>
        <StatusPill status={l.status} />
      </div>
      <p className="mt-3 text-[15px] text-tinta-2">{l.objective}</p>

      {l.segments.map((s) => (
        <section key={s.n} className="mt-10">
          <h2 className="text-[22px] leading-snug">{s.n}. {s.title}</h2>
          <div className="guion mt-3 text-[16px]" dangerouslySetInnerHTML={{ __html: s.html }} />
          {l.questions.filter((q) => q.after_segment === s.n).map((q) => (
            <div key={q.id} className="mt-5 rounded-tarjeta border border-linea bg-blanco p-5">
              <p className="text-[12px] font-bold text-gris-texto">Pregunta · {q.concept_tag}</p>
              <p className="mt-1 text-[16px] font-semibold">{q.prompt}</p>
              <ul className="mt-3 space-y-2.5">
                {q.options.map((o) => (
                  <li key={o.id} className={`rounded-boton border p-3 ${o.correct ? "border-correcto bg-correcto-suave" : "border-linea"}`}>
                    <p className="text-[15px] font-medium">{o.id.toUpperCase()}. {o.text}</p>
                    <p className={`mt-1 text-[14px] ${o.correct ? "text-correcto" : "text-gris-texto"}`}>{o.feedback}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {l.checklist.length > 0 && (
        <section className="mt-10 rounded-tarjeta bg-tinta p-5 text-blanco">
          <h2 className="font-cuerpo text-[16px] font-bold">Checklist descargable</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px]">{l.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </section>
      )}
    </main>
  );
}
