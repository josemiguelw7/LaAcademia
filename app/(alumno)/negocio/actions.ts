"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireGraduate, currentTaxYear, AGREEMENT_VERSION } from "@/lib/platform";
import { encryptField } from "@/lib/crypto";
import { parseAnswers, isComplete, type Answers } from "@/lib/questionnaire";
import { syncCase } from "@/lib/case-sync";
import { isDocKind } from "@/lib/documents";

type State = { error: string | null } | null;

export async function createFirm(_: State, form: FormData): Promise<State> {
  const { v, sb, firm } = await requireGraduate();
  if (firm) redirect("/negocio");
  const name = String(form.get("business_name") ?? "").trim();
  const ptin = String(form.get("ptin_last4") ?? "").replace(/\D/g, "");
  if (name.length < 2) return { error: "Escribe el nombre de tu negocio." };
  if (ptin && ptin.length !== 4) return { error: "Del PTIN solo necesito los últimos 4 números." };
  if (form.get("agreement") !== "acepto") return { error: "Para empezar necesito que aceptes el acuerdo del programa." };
  const { error } = await sb.from("firms").insert({
    owner_id: v.id, business_name: name, ptin_last4: ptin || null,
    agreement_version: AGREEMENT_VERSION, agreement_signed_at: new Date().toISOString(),
  });
  if (error) return { error: "No pude guardar tu negocio. Vuelve a intentarlo." };
  redirect("/negocio");
}

export async function createClientAndCase(_: State, form: FormData): Promise<State> {
  const { sb, firm } = await requireGraduate();
  if (!firm) redirect("/negocio");
  const year = await currentTaxYear(sb);
  if (!year) return { error: "Todavía no hay una temporada abierta." };
  const full_name = String(form.get("full_name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase() || null;
  const phone = String(form.get("phone") ?? "").replace(/[^\d+]/g, "") || null;
  const ssn = String(form.get("ssn") ?? "").replace(/\D/g, "");
  if (full_name.length < 3) return { error: "Escribe el nombre completo del cliente." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Ese correo no parece válido." };
  if (ssn && ssn.length !== 9) return { error: "El Seguro Social o ITIN tiene 9 números." };
  const { data: client, error } = await sb.from("clients").insert({
    firm_id: firm.id, full_name, email, phone_e164: phone,
    ...(ssn ? { ssn_enc: encryptField(ssn), ssn_last4: ssn.slice(-4) } : {}),
  }).select("id").single();
  if (error || !client) return { error: "No pude guardar al cliente. Vuelve a intentarlo." };
  const { data: kase, error: e2 } = await sb.from("cases").insert({ firm_id: firm.id, client_id: client.id, tax_year: year }).select("id").single();
  if (e2 || !kase) return { error: "Guardé al cliente, pero no pude abrir su caso." };
  redirect(`/negocio/casos/${kase.id}`);
}

/** Guarda el cuestionario y ajusta la lista de documentos: agrega lo que falta pedir y quita
 *  lo pendiente que ya no aplica. Nunca toca un documento recibido o marcado «no aplica». */
export async function saveQuestionnaire(caseId: string, form: FormData) {
  const { sb } = await requireGraduate();
  const answers: Answers = parseAnswers(form);
  const complete = isComplete(answers);
  await syncCase(sb, caseId, answers, complete);
  revalidatePath(`/negocio/casos/${caseId}`);
}

export async function setDocStatus(form: FormData) {
  const { sb } = await requireGraduate();
  const id = String(form.get("doc_id"));
  const caseId = String(form.get("case_id"));
  const status = form.get("status") === "no_aplica" ? "no_aplica" : "esperado";
  await sb.from("case_documents").update({ status }).eq("id", id).neq("status", "recibido");
  revalidatePath(`/negocio/casos/${caseId}`);
}

export async function addDocument(form: FormData) {
  const { sb } = await requireGraduate();
  const caseId = String(form.get("case_id"));
  const kind = String(form.get("kind"));
  const label = String(form.get("label") ?? "").trim().slice(0, 120) || null;
  if (!isDocKind(kind)) return;
  await sb.from("case_documents").insert({ case_id: caseId, kind, label });
  revalidatePath(`/negocio/casos/${caseId}`);
}
