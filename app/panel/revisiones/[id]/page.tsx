import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { maskSsn } from "@/lib/crypto";
import { QUESTIONS, type Answers } from "@/lib/questionnaire";
import { DOC_KINDS } from "@/lib/documents";
import { BAND_LABEL } from "@/lib/score";
import { DecisionForm } from "./DecisionForm";
import { addStrike } from "../actions";

export const metadata = { title: "Revisión · Panel" };

const show = (q: (typeof QUESTIONS)[number], v: Answers[string] | undefined) => {
  if (v === undefined) return "—";
  if (q.type === "yesno") return v ? "Sí" : "No";
  if (q.type === "choice") return q.options.find((o) => o.value === v)?.label ?? String(v);
  return String(v);
};

export default async function Revision({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await requireViewer();
  if (v.role !== "directora") redirect("/panel/revisiones");
  const sb = await createClient();
  const { data: r } = await sb.from("return_reviews")
    .select("id, version, submitted_at, decision, notes, cases(id, tax_year, score, score_reasons, random_audit, questionnaire, firm_id, clients(full_name, ssn_last4), firms(business_name), case_documents(id, kind, label, status), return_reviews(id, version, decision, notes))")
    .eq("id", id).maybeSingle();
  if (!r) notFound();
  type C = { id: string; tax_year: number; score: number | null; score_reasons: string[]; random_audit: boolean; questionnaire: { answers?: Answers } | null; firm_id: string;
    clients: { full_name: string; ssn_last4: string | null }; firms: { business_name: string };
    case_documents: { id: string; kind: string; label: string | null; status: string }[]; return_reviews: { id: string; version: number; decision: string | null; notes: string | null }[] };
  const c = r.cases as unknown as C;
  const answers = c.questionnaire?.answers ?? {};
  const band = c.score === null ? null : c.score >= 90 ? "rapida" : c.score >= 70 ? "marcada" : "completa";
  const previous = c.return_reviews.filter((x) => x.version < r.version && x.notes).sort((a, b) => b.version - a.version);

  return (
    <main className="mt-6">
      <Link href="/panel/revisiones" className="text-[14px] font-semibold text-bronce-oscuro">← Revisiones</Link>
      <h1 className="mt-3 text-[26px] leading-tight">{c.clients.full_name}</h1>
      <p className="mt-1 text-[14px] text-gris-texto cifras">{c.firms.business_name} · Temporada {c.tax_year} · {maskSsn(c.clients.ssn_last4)} · Versión {r.version}</p>

      <section className="mt-6 rounded-tarjeta border border-linea bg-blanco p-4">
        <p className="text-[14px] font-semibold">
          Puntaje <span className="font-titulo text-[22px] cifras">{c.score ?? "—"}</span>
          {band && <> · {c.random_audit ? "Elegida al azar para revisión a fondo" : BAND_LABEL[band]}</>}
        </p>
        {c.score_reasons.length > 0 && <ul className="mt-2 list-disc pl-5 text-[15px] text-tinta-2">{c.score_reasons.map((x) => <li key={x}>{x}</li>)}</ul>}
        <a href={`/declaraciones/${r.id}`} target="_blank" rel="noopener" className="mt-4 flex h-[52px] items-center justify-center rounded-boton bg-tinta text-[16px] font-bold text-blanco">Abrir la declaración (PDF)</a>
      </section>

      {previous.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[18px]">Lo que pediste antes</h2>
          {previous.map((p) => <p key={p.id} className="mt-2 rounded-boton bg-bronce-suave p-3 text-[15px]">Versión {p.version}: «{p.notes}»</p>)}
        </section>
      )}

      {r.decision === null ? <DecisionForm reviewId={r.id} /> : <p className="mt-6 text-[15px] font-semibold">Ya decidida: {r.decision}.</p>}

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="text-[18px]">Documentos del cliente</h2>
          <ul className="mt-2 space-y-1.5 text-[15px]">
            {c.case_documents.map((d) => (
              <li key={d.id} className="flex justify-between gap-3">
                <span>{d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind}</span>
                {d.status === "recibido"
                  ? <a href={`/negocio/documentos/${d.id}`} target="_blank" rel="noopener" className="font-semibold text-bronce-oscuro underline underline-offset-4">Ver</a>
                  : <span className="text-gris-texto">{d.status === "no_aplica" ? "No aplica" : "Falta"}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[18px]">Lo que contestó</h2>
          <dl className="mt-2 space-y-1.5 text-[14px]">
            {QUESTIONS.map((q) => <div key={q.id}><dt className="text-gris-texto">{q.label}</dt><dd className="font-semibold">{show(q, answers[q.id])}</dd></div>)}
          </dl>
        </div>
      </section>

      <details className="mt-10">
        <summary className="cursor-pointer text-[14px] font-semibold text-bronce-oscuro">Registrar que envió sin mi aprobación</summary>
        <form action={addStrike} className="mt-3 space-y-3">
          <input type="hidden" name="firm_id" value={c.firm_id} />
          <input type="hidden" name="tax_year" value={c.tax_year} />
          <input type="hidden" name="case_id" value={c.id} />
          <textarea name="note" rows={2} className="w-full rounded-boton border border-linea bg-blanco p-3 text-[15px]" placeholder="Qué pasó (opcional)" />
          <p className="text-[13px] text-gris-texto">La primera vez queda como advertencia. A la segunda, su revisión se suspende por el resto de la temporada.</p>
          <button className="h-11 rounded-boton border-[1.5px] border-error px-4 text-[15px] font-semibold text-error">Registrar falta</button>
        </form>
      </details>
    </main>
  );
}
