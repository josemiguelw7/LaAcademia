import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { expectedDocs, QUESTIONNAIRE_VERSION, type Answers } from "@/lib/questionnaire";

const ALL_YES: Answers = { w2: 10, propio: true, intereses: true, desempleo: true, seguro_social: true, retiro: true, mercado: true, estudios: true, hipoteca: true, acciones: true };
const W2_SINGLE: Answers = { w2: 1 };

/** Guarda respuestas y ajusta la lista de documentos del caso. Funciona con el cliente del graduado
 *  (reglas de acceso aplican) o con el del servidor cuando contesta el cliente por su enlace. */
export async function syncCase(sb: SupabaseClient, caseId: string, answers: Answers, complete: boolean) {
  const { error } = await sb.from("cases").update({
    questionnaire: { version: QUESTIONNAIRE_VERSION, answers },
    questionnaire_completed_at: complete ? new Date().toISOString() : null,
  }).eq("id", caseId);
  if (error) throw new Error("no_se_guardo");
  const want = expectedDocs(answers);
  const { data: docs } = await sb.from("case_documents").select("id, kind, label, status").eq("case_id", caseId);
  const have = docs ?? [];
  const key = (k: string, l: string | null) => `${k}|${l ?? ""}`;
  const haveKeys = new Set(have.map((d) => key(d.kind, d.label)));
  const wantKeys = new Set(want.map((d) => key(d.kind, d.label)));
  const toAdd = want.filter((d) => !haveKeys.has(key(d.kind, d.label)));
  // solo se quita lo que el cuestionario mismo había pedido; lo que agregó el graduado a mano se queda
  const autoKeys = new Set([...expectedDocs(ALL_YES), ...expectedDocs(W2_SINGLE)].map((d) => key(d.kind, d.label)));
  const toDrop = have.filter((d) => d.status === "esperado" && !wantKeys.has(key(d.kind, d.label)) && autoKeys.has(key(d.kind, d.label)));
  if (toAdd.length) await sb.from("case_documents").insert(toAdd.map((d) => ({ case_id: caseId, kind: d.kind, label: d.label })));
  if (toDrop.length) await sb.from("case_documents").delete().in("id", toDrop.map((d) => d.id));
}

