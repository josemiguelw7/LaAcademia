import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireGraduate } from "@/lib/platform";
import { maskSsn } from "@/lib/crypto";
import { QUESTIONS, type Answers } from "@/lib/questionnaire";
import { DOC_KINDS, DOC_STATUS_LABEL, type DocStatus } from "@/lib/documents";
import { saveQuestionnaire, setDocStatus, addDocument } from "../../actions";

export const metadata = { title: "Caso · La Academia" };

const chip: Record<DocStatus, string> = {
  esperado: "border-linea bg-blanco text-tinta-2",
  recibido: "border-correcto bg-correcto-suave text-correcto",
  no_aplica: "border-linea bg-marfil text-gris-texto",
};
const field = "mt-1 h-12 w-full rounded-boton border border-linea bg-blanco px-3 text-[16px] outline-none focus:border-tinta";

export default async function Caso({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, firm } = await requireGraduate();
  if (!firm) redirect("/negocio");
  const { data: c } = await sb.from("cases")
    .select("id, status, tax_year, questionnaire, questionnaire_completed_at, clients(full_name, email, phone_e164, ssn_last4), case_documents(id, kind, label, status, uploaded_at)")
    .eq("id", id).maybeSingle();
  if (!c) notFound();
  const client = c.clients as unknown as { full_name: string; email: string | null; phone_e164: string | null; ssn_last4: string | null };
  const answers = ((c.questionnaire as { answers?: Answers } | null)?.answers ?? {}) as Answers;
  const docs = [...((c.case_documents ?? []) as { id: string; kind: string; label: string | null; status: DocStatus; uploaded_at: string | null }[])]
    .sort((a, b) => ["esperado", "recibido", "no_aplica"].indexOf(a.status) - ["esperado", "recibido", "no_aplica"].indexOf(b.status));
  const missing = docs.filter((d) => d.status === "esperado").length;
  const save = saveQuestionnaire.bind(null, c.id);

  return (
    <main className="px-5 pt-8 sm:px-8">
      <Link href="/negocio" className="text-[14px] font-semibold text-bronce-oscuro">← Mi negocio</Link>
      <h1 className="mt-4 text-[26px] leading-tight sm:text-[32px]">{client.full_name}</h1>
      <p className="mt-1 text-[14px] text-gris-texto cifras">
        Temporada {c.tax_year} · Seguro Social o ITIN {maskSsn(client.ssn_last4)}
        {client.email ? ` · ${client.email}` : ""}
      </p>

      <section className="mt-8">
        <h2 className="text-[20px]">Documentos</h2>
        <p className="mt-1 text-[15px] text-tinta-2">
          {docs.length === 0 ? "Contesta el cuestionario y aquí aparece lo que hay que pedir." : missing ? `Faltan ${missing}.` : "Todo recibido."}
        </p>
        <ul className="mt-3 space-y-2">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 rounded-tarjeta border border-linea bg-blanco p-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold">{d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind}</p>
                <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[12px] font-semibold ${chip[d.status]}`}>{DOC_STATUS_LABEL[d.status]}</span>
              </div>
              {d.status !== "recibido" && (
                <form action={setDocStatus}>
                  <input type="hidden" name="doc_id" value={d.id} />
                  <input type="hidden" name="case_id" value={c.id} />
                  <input type="hidden" name="status" value={d.status === "no_aplica" ? "esperado" : "no_aplica"} />
                  <button className="text-[13px] font-semibold text-bronce-oscuro underline underline-offset-4">
                    {d.status === "no_aplica" ? "Sí aplica" : "No aplica"}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
        <form action={addDocument} className="mt-3 flex flex-wrap items-end gap-2">
          <input type="hidden" name="case_id" value={c.id} />
          <label className="min-w-[140px] flex-1 text-[13px] font-semibold text-tinta-2">Pedir otro
            <select name="kind" className={field} defaultValue="otro">
              {Object.entries(DOC_KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="min-w-[160px] flex-[2] text-[13px] font-semibold text-tinta-2">Nota (opcional)
            <input name="label" className={field} placeholder="Recibo de guardería" />
          </label>
          <button className="h-12 rounded-boton border-[1.5px] border-tinta px-4 text-[15px] font-semibold">Agregar</button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-[20px]">Cuestionario</h2>
        <p className="mt-1 text-[15px] text-tinta-2">
          {c.questionnaire_completed_at ? "Completo. Si algo cambia, corrígelo y la lista se ajusta sola." : "Puedes llenarlo con tu cliente aquí, o mandarle su enlace para que lo conteste él."}
        </p>
        <form action={save} className="mt-4 space-y-5">
          {QUESTIONS.map((q) => (
            <fieldset key={q.id} className="rounded-tarjeta border border-linea bg-blanco p-4">
              <legend className="px-1 text-[16px] font-semibold">{q.label}</legend>
              {"hint" in q && q.hint && <p className="text-[14px] text-gris-texto">{q.hint}</p>}
              {q.type === "choice" && (
                <div className="mt-2 space-y-2">
                  {q.options.map((o) => (
                    <label key={o.value} className="flex items-center gap-3 text-[15px]">
                      <input type="radio" name={q.id} value={o.value} defaultChecked={answers[q.id] === o.value} className="h-5 w-5 accent-[var(--color-tinta)]" />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "count" && (
                <input type="number" name={q.id} min={0} max={q.max} inputMode="numeric" defaultValue={answers[q.id] === undefined ? "" : String(answers[q.id])} className={`${field} max-w-[120px]`} />
              )}
              {q.type === "yesno" && (
                <div className="mt-2 flex gap-6">
                  {[["si", "Sí", true], ["no", "No", false]].map(([val, lab, b]) => (
                    <label key={String(val)} className="flex items-center gap-2 text-[15px]">
                      <input type="radio" name={q.id} value={String(val)} defaultChecked={answers[q.id] === b} className="h-5 w-5 accent-[var(--color-tinta)]" />
                      {String(lab)}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          ))}
          <button className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco">Guardar respuestas</button>
        </form>
      </section>
    </main>
  );
}
