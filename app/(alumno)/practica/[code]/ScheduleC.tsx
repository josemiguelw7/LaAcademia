"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { gradeCase, type GradeResult } from "./actions";

type Box = { id: string; line_no: string; label: string };
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function ScheduleC({ title, caseTitle, narrative, documents, caseId, boxes, taxYear }: {
  title: string; caseTitle: string; narrative: string; documents: { t: string; d: string }[]; caseId: string; boxes: Box[]; taxYear: number;
}) {
  const [tab, setTab] = useState<"docs" | "form">("docs");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [res, setRes] = useState<GradeResult | null>(null);
  const [hint, setHint] = useState(false);
  const [pending, start] = useTransition();
  const byId = new Map(res?.boxes.map((b) => [b.id, b]));
  const all = res && res.correct === res.total;

  const docs = (
    <section className="rounded-tarjeta border border-linea bg-blanco p-5">
      <h2 className="font-cuerpo text-[16px] font-bold">{caseTitle}</h2>
      <p className="mt-2 text-[15px] text-tinta-2">{narrative}</p>
      <ol className="mt-4 space-y-3">
        {documents.map((d, i) => (
          <li key={i} className="border-t border-linea pt-3 text-[15px]"><p className="font-semibold">{i + 1}. {d.t}</p><p className="text-tinta-2">{d.d}</p></li>
        ))}
      </ol>
    </section>
  );

  const form = (
    <section>
      <div className="rounded-formulario border border-tinta bg-blanco">
        <div className="flex items-center justify-between border-b border-tinta px-3 py-2">
          <p className="text-[13px] font-bold">SCHEDULE C (Form 1040)</p><p className="text-[12px] cifras">{taxYear}</p>
        </div>
        {boxes.map((b) => {
          const r = byId.get(b.id);
          const border = r ? (r.ok ? "border-correcto bg-correcto-suave" : "border-error bg-error-suave") : "border-linea bg-blanco";
          return (
            <div key={b.id} className="border-b border-tinta px-3 py-2.5 last:border-b-0">
              <label htmlFor={b.id} className="flex items-center gap-3">
                <span className="w-9 shrink-0 text-[13px] font-bold cifras">{b.line_no}</span>
                <span className="flex-1 text-[13px]">{b.label}</span>
                <span className="relative">
                  <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-gris-texto">$</span>
                  <input id={b.id} inputMode="decimal" value={answers[b.id] ?? ""} disabled={pending}
                    onChange={(e) => setAnswers({ ...answers, [b.id]: e.target.value })}
                    className={`h-11 w-32 rounded-formulario border pl-5 pr-2 text-right text-[15px] cifras outline-none focus:border-tinta ${border}`} />
                </span>
              </label>
              {r && !r.ok && r.note && <p className="mt-2 text-[14px] text-error">{r.note}</p>}
            </div>
          );
        })}
        {res && (
          <div className="flex items-center gap-3 border-t border-tinta bg-marfil px-3 py-2.5 text-gris-texto">
            <span className="w-9 text-[13px] font-bold cifras">31</span><span className="flex-1 text-[13px]">Net profit (calculada)</span>
            <span className="w-32 text-right text-[15px] cifras">{all ? `$${money(res.netProfit)}` : "—"}</span>
          </div>
        )}
      </div>
      {hint && <p className="mt-4 rounded-boton bg-bronce-suave p-4 text-[15px]">Primero separa los papeles en tres montones: lo que entró, lo que gastó el negocio, y lo que no es del negocio.</p>}
    </section>
  );

  return (
    <main className="px-5 pb-10 pt-6 sm:px-8">
      <Link href="/curso" className="text-[14px] font-semibold text-bronce-oscuro">← Curso</Link>
      <h1 className="mt-4 text-[26px] leading-tight">{title}</h1>
      {res && <p className={`mt-3 text-[16px] font-semibold ${all ? "text-correcto" : "text-tinta"}`}>{all ? "Todas correctas. Así se ve un Anexo C que aguanta cualquier pregunta." : `${res.correct} de ${res.total} casillas correctas`}</p>}
      <div className="mt-5 flex rounded-boton border border-linea bg-blanco p-1 lg:hidden">
        {(["docs", "form"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`h-10 flex-1 rounded-[9px] text-[14px] font-semibold ${tab === t ? "bg-tinta text-blanco" : "text-gris-texto"}`}>{t === "docs" ? "Documentos" : "Anexo C"}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className={tab === "docs" ? "" : "hidden lg:block"}>{docs}</div>
        <div className={tab === "form" ? "" : "hidden lg:block"}>{form}</div>
      </div>
      <div className="mt-6 space-y-3">
        <button onClick={() => { setTab("form"); start(async () => setRes(await gradeCase(caseId, answers))); }} disabled={pending}
          className="h-[52px] w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco disabled:bg-deshabilitado-bg disabled:text-deshabilitado-fg">
          {pending ? "Revisando…" : res ? "Revisar de nuevo" : "Revisar"}
        </button>
        {!all && <button onClick={() => setHint(true)} className="h-[52px] w-full rounded-boton border-[1.5px] border-linea bg-blanco text-[15px] font-semibold">Pista</button>}
      </div>
    </main>
  );
}
