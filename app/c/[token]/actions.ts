"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { resolveIntake } from "@/lib/intake";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONSENT_VERSION } from "@/lib/consent";
import { parseAnswers, isComplete } from "@/lib/questionnaire";
import { syncCase } from "@/lib/case-sync";
import { clientIp } from "@/lib/doc-storage";

type State = { error: string | null } | null;

export async function signConsent(token: string, _: State, form: FormData): Promise<State> {
  const intake = await resolveIntake(token);
  if (!intake) return { error: "Este enlace ya no funciona." };
  const name = String(form.get("signer_name") ?? "").trim();
  if (name.length < 3) return { error: "Escribe tu nombre completo para firmar." };
  if (form.get("acepto") !== "si") return { error: "Marca la casilla para dar tu permiso." };
  const h = await headers();
  const { error } = await createAdminClient().from("consents").upsert({
    case_id: intake.caseId, kind: "7216_divulgar", text_version: CONSENT_VERSION, signer_name: name,
    ip: clientIp(h), user_agent: (h.get("user-agent") ?? "").slice(0, 300),
  }, { onConflict: "case_id,kind,text_version", ignoreDuplicates: true });
  if (error) return { error: "No pude guardar tu firma. Vuelve a intentarlo." };
  revalidatePath(`/c/${token}`);
  return { error: null };
}

export async function saveClientQuestionnaire(token: string, form: FormData) {
  const intake = await resolveIntake(token);
  if (!intake || !intake.consented) return;
  const answers = parseAnswers(form);
  await syncCase(createAdminClient(), intake.caseId, answers, isComplete(answers));
  revalidatePath(`/c/${token}`);
}
