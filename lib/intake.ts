import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashToken, newToken } from "@/lib/crypto";
import { CONSENT_VERSION } from "@/lib/consent";
import type { Answers } from "@/lib/questionnaire";
import type { DocStatus } from "@/lib/documents";

export const LINK_DAYS = 30;

export type IntakeCase = {
  linkId: string; caseId: string; firmId: string; business: string; clientFirstName: string; taxYear: number;
  purgeOn: string; consented: boolean; answers: Answers; complete: boolean;
  docs: { id: string; kind: string; label: string | null; status: DocStatus }[];
};

/** El caso detrás de un enlace del cliente, o null si el enlace no existe, venció o se revocó. */
export async function resolveIntake(token: string): Promise<IntakeCase | null> {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const db = createAdminClient();
  const { data: link } = await db.from("intake_links").select("id, case_id, expires_at, revoked_at").eq("token_hash", toBytea(hashToken(token))).maybeSingle();
  if (!link || link.revoked_at || new Date(link.expires_at) < new Date()) return null;
  const { data: c } = await db.from("cases")
    .select("id, firm_id, tax_year, questionnaire, questionnaire_completed_at, firms(business_name), clients(full_name), seasons(purge_on), case_documents(id, kind, label, status), consents(kind, text_version)")
    .eq("id", link.case_id).single();
  if (!c) return null;
  await db.from("intake_links").update({ last_used_at: new Date().toISOString() }).eq("id", link.id);
  const consents = (c.consents ?? []) as { kind: string; text_version: string }[];
  return {
    linkId: link.id, caseId: c.id, firmId: c.firm_id, taxYear: c.tax_year,
    business: (c.firms as unknown as { business_name: string }).business_name,
    clientFirstName: (c.clients as unknown as { full_name: string }).full_name.split(" ")[0],
    purgeOn: (c.seasons as unknown as { purge_on: string }).purge_on,
    consented: consents.some((x) => x.kind === "7216_divulgar" && x.text_version === CONSENT_VERSION),
    answers: ((c.questionnaire as { answers?: Answers } | null)?.answers ?? {}) as Answers,
    complete: !!c.questionnaire_completed_at,
    docs: (c.case_documents ?? []) as IntakeCase["docs"],
  };
}

/** Crea un enlace nuevo para el caso y revoca los anteriores. Devuelve el token una sola vez. */
export async function issueIntakeLink(caseId: string): Promise<string> {
  const db = createAdminClient();
  const now = new Date();
  await db.from("intake_links").update({ revoked_at: now.toISOString() }).eq("case_id", caseId).is("revoked_at", null);
  const token = newToken();
  const expires = new Date(now.getTime() + LINK_DAYS * 864e5);
  const { error } = await db.from("intake_links").insert({ case_id: caseId, token_hash: toBytea(hashToken(token)), expires_at: expires.toISOString() });
  if (error) throw new Error("no_se_creo_el_enlace");
  return token;
}

/** PostgREST recibe bytea como texto hexadecimal \x… */
const toBytea = (b: Buffer) => `\\x${b.toString("hex")}`;
