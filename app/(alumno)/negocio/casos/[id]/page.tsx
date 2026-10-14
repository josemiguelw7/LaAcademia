import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireGraduate } from "@/lib/platform";
import { maskSsn } from "@/lib/crypto";
import type { Answers } from "@/lib/questionnaire";
import { QuestionnaireFields } from "@/components/questionnaire/Fields";
import { Uploader } from "@/components/upload/Uploader";
import { IntakeLink } from "./IntakeLink";
import { DOC_KINDS, DOC_STATUS_LABEL, type DocStatus } from "@/lib/documents";
import { saveQuestionnaire, setDocStatus, addDocument, markFiled } from "../../actions";
import { DeclarationUpload } from "./DeclarationUpload";
import { BAND_LABEL } from "@/lib/score";

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
    .select("id, status, tax_year, score, score_reasons, review_mode, questionnaire, questionnaire_completed_at, clients(full_name, email, phone_e164, ssn_last4), case_documents(id, kind, label, status, uploaded_at), consents(kind), return_reviews(id, version, submitted_at, decision, decided_at, notes)")
    .eq("id", id).maybeSingle();
  if (!c) notFound();
  const client = c.clients as unknown as { full_name: string; email: string | null; phone_e164: string | null; ssn_last4: string | null };
  const answers = ((c.questionnaire as { answers?: Answers } | null)?.answers ?? {}) as Answers;
  const docs = [...((c.case_documents ?? []) as { id: string; kind: string; label: string | null; status: DocStatus; uploaded_at: string | null }[])]
    .sort((a, b) => ["esperado", "recibido", "no_aplica"].indexOf(a.status) - ["esperado", "recibido", "no_aplica"].indexOf(b.status));
  const missing = docs.filter((d) => d.status === "esperado").length;
  const consented = ((c.consents ?? []) as { kind: string }[]).some((x) => x.kind === "7216_divulgar");
  const save = saveQuestionnaire.bind(null, c.id);
  const reviews = [...((c.return_reviews ?? []) as { id: string; version: number; submitted_at: string; decision: string | null; decided_at: string | null; notes: string | null }[])].sort((a, b) => b.version - a.version);
  const band = c.score === null ? null : c.score >= 90 ? "rapida" : c.score >= 70 ? "marcada" : "completa";
  const fecha = (d: string) => new Date(d).toLocaleDateString("es-US", { day: "numeric", month: "long", timeZone: "America/Chicago" });

  return (
    <main className="px-5 pt-8 sm:px-8">
      <Link href="/negocio" className="text-[14px] font-semibold text-bronce-oscuro">← Mi negocio</Link>
      <h1 className="mt-4 text-[26px] leading-tight sm:text-[32px]">{client.full_name}</h1>
      <p className="mt-1 text-[14px] text-gris-texto cifras">
        Temporada {c.tax_year} · Seguro Social o ITIN {maskSsn(client.ssn_last4)}
        {client.email ? ` · ${client.email}` : ""}
      </p>
      <p className="mt-2 text-[14px] font-semibold">
        {consented ? <span className="text-correcto">✓ Permiso del cliente firmado</span> : <span className="text-bronce-oscuro">Falta el permiso del cliente: lo firma con su enlace</span>}
      </p>
      <IntakeLink caseId={c.id} clientName={client.full_name} />

      <section className="mt-8 rounded-tarjeta border border-linea bg-blanco p-4">
        <h2 className="text-[20px]">Revisión con Liliana</h2>
        {c.status === "en_revision" && <p className="mt-1 text-[15px] text-tinta-2">En revisión. Te aviso aquí en cuanto la revise.</p>}
        {c.status === "aprobada" && (
          <>
            <p className="mt-1 text-[15px] font-semibold text-correcto">✓ Aprobada. Ya puedes enviarla en TaxAct con tu EFIN.</p>
            <form action={markFiled} className="mt-3">
              <input type="hidden" name="case_id" value={c.id} />
              <button className="h-11 w-full rounded-boton border-[1.5px] border-tinta text-[15px] font-semibold">Ya la envié</button>
            </form>
          </>
        )}
        {c.status === "enviada" && <p className="mt-1 text-[15px] font-semibold text-correcto">✓ Enviada.</p>}
        {(c.status === "recepcion" || c.status === "listo_para_preparar" || c.status === "devuelta") && (
          <>
            <p className="mt-1 text-[15px] text-tinta-2">
              {c.status === "devuelta" ? "Te la devolví con notas. Corrígela en TaxAct y mándame la nueva versión." : "Cuando la prepares en TaxAct, mándamela antes de enviarla."}
            </p>
            {consented ? <DeclarationUpload caseId={c.id} again={c.status === "devuelta"} /> : <p className="mt-2 text-[14px] font-semibold text-bronce-oscuro">Primero tu cliente tiene que firmar su permiso con su enlace.</p>}
          </>
        )}
        {band && c.score !== null && (
          <div className="mt-4 border-t border-linea pt-3">
            <p className="text-[14px] font-semibold">Puntaje <span className="cifras">{c.score}</span> · {BAND_LABEL[band]}</p>
            {(c.score_reasons as string[]).length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-[14px] text-tinta-2">{(c.score_reasons as string[]).map((r) => <li key={r}>{r}</li>)}</ul>
            )}
          </div>
        )}
        {reviews.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-linea pt-3">
            {reviews.map((r) => (
              <li key={r.id} className="text-[14px]">
                <a href={`/declaraciones/${r.id}`} target="_blank" rel="noopener" className="font-semibold text-bronce-oscuro underline underline-offset-4">Versión {r.version}</a>
                <span className="text-gris-texto"> · mandada el {fecha(r.submitted_at)}{r.decision ? ` · ${r.decision === "aprobada" ? "aprobada" : "devuelta"} el ${fecha(r.decided_at!)}` : " · en revisión"}</span>
                {r.notes && <p className="mt-1 rounded-boton bg-bronce-suave p-3 text-[15px] text-tinta">«{r.notes}» — Liliana</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-[20px]">Documentos</h2>
        <p className="mt-1 text-[15px] text-tinta-2">
          {docs.length === 0 ? "Contesta el cuestionario y aquí aparece lo que hay que pedir." : missing ? `Faltan ${missing}.` : "Todo recibido."}
        </p>
        {docs.length > 0 && (
          <div className="mt-3">
            <Uploader endpoint={`/negocio/casos/${c.id}/subir`} viewHref={(docId) => `/negocio/documentos/${docId}`}
              docs={docs.map((d) => ({ id: d.id, status: d.status, label: d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind }))} />
          </div>
        )}
        {docs.some((d) => d.status !== "recibido") && (
          <details className="mt-3">
            <summary className="cursor-pointer text-[14px] font-semibold text-bronce-oscuro">Marcar «no aplica»</summary>
            <ul className="mt-2 space-y-2">
              {docs.filter((d) => d.status !== "recibido").map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 rounded-tarjeta border border-linea bg-blanco p-3">
                  <span className="text-[15px]">{d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind}
                    <span className={`ml-2 inline-block rounded-full border px-2 py-0.5 text-[12px] font-semibold ${chip[d.status]}`}>{DOC_STATUS_LABEL[d.status]}</span>
                  </span>
                  <form action={setDocStatus}>
                    <input type="hidden" name="doc_id" value={d.id} />
                    <input type="hidden" name="case_id" value={c.id} />
                    <input type="hidden" name="status" value={d.status === "no_aplica" ? "esperado" : "no_aplica"} />
                    <button className="text-[13px] font-semibold text-bronce-oscuro underline underline-offset-4">{d.status === "no_aplica" ? "Sí aplica" : "No aplica"}</button>
                  </form>
                </li>
              ))}
            </ul>
          </details>
        )}
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
          <QuestionnaireFields answers={answers} />
          <button className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco">Guardar respuestas</button>
        </form>
      </section>
    </main>
  );
}
