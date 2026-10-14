import "server-only";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptFile, decryptFile } from "@/lib/crypto";
import { sniff, MAX_BYTES, DocError } from "@/lib/doc-storage";
import { scoreCase, SCORE_VERSION, RANDOM_AUDIT_RATE } from "@/lib/score";
import type { Answers } from "@/lib/questionnaire";

const BUCKET = "declaraciones";

const DB_ERRORS: Record<string, string> = {
  cupo_agotado: "Ya usaste todas tus revisiones de esta temporada. Puedes pedir un paquete de 10 más.",
  revision_suspendida: "La revisión está suspendida por el resto de la temporada.",
  revision_pendiente: "Esta declaración ya está en revisión. Espera mi respuesta.",
};

/** Sube la declaración en PDF, la manda a revisión (las reglas de cupo y faltas viven en la base)
 *  y calcula el puntaje. `sb` es el cliente del graduado: la inserción pasa por sus reglas de acceso. */
export async function submitForReview(opts: { sb: import("@supabase/supabase-js").SupabaseClient; caseId: string; userId: string; bytes: Buffer }) {
  if (opts.bytes.length === 0 || opts.bytes.length > MAX_BYTES) throw new DocError("El PDF pesa más de 4 MB.");
  if (sniff(opts.bytes) !== "application/pdf") throw new DocError("La declaración tiene que ser un PDF.");
  const db = createAdminClient();
  const { data: c } = await db.from("cases").select("id, firm_id, questionnaire, case_documents(kind, label, status), consents(kind)").eq("id", opts.caseId).single();
  if (!c) throw new DocError("No encontré el caso.");
  if (!((c.consents ?? []) as { kind: string }[]).some((x) => x.kind === "7216_divulgar")) {
    throw new DocError("Falta el permiso firmado de tu cliente. Mándale su enlace para que lo firme.");
  }
  const { data, keyVersion, sha256 } = encryptFile(opts.bytes);
  const path = `${c.firm_id}/${opts.caseId}/declaracion-${randomUUID()}.bin`;
  const up = await db.storage.from(BUCKET).upload(path, data, { contentType: "application/octet-stream", upsert: false });
  if (up.error) throw new DocError("No pude guardar el PDF. Vuelve a intentarlo.");
  const { data: review, error } = await opts.sb.from("return_reviews")
    .insert({ case_id: opts.caseId, pdf_path: path, size_bytes: opts.bytes.length, sha256, key_version: keyVersion, submitted_by: opts.userId })
    .select("id").single();
  if (error || !review) {
    await db.storage.from(BUCKET).remove([path]);
    const code = Object.keys(DB_ERRORS).find((k) => error?.message?.includes(k));
    throw new DocError(code ? DB_ERRORS[code] : "No pude mandarla a revisión. Vuelve a intentarlo.");
  }
  const answers = ((c.questionnaire as { answers?: Answers } | null)?.answers ?? {}) as Answers;
  const r = scoreCase({ answers, docs: (c.case_documents ?? []) as { kind: string; label: string | null; status: string }[] });
  const audit = r.band === "rapida" && Math.random() < RANDOM_AUDIT_RATE;
  await db.from("cases").update({
    score: r.score, score_reasons: r.reasons, score_version: SCORE_VERSION,
    review_mode: r.band === "rapida" && !audit ? "rapida" : "a_fondo", random_audit: audit,
  }).eq("id", opts.caseId);
  await db.from("access_log").insert({ actor_id: opts.userId, actor_kind: "graduado", case_id: opts.caseId, object_kind: "declaracion", object_id: review.id, action: "subir" });
}

export async function readDeclaration(path: string): Promise<Buffer> {
  const { data, error } = await createAdminClient().storage.from(BUCKET).download(path);
  if (error || !data) throw new DocError("No encontré el PDF.");
  return decryptFile(Buffer.from(await data.arrayBuffer()));
}
