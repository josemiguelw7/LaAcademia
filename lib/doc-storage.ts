import "server-only";
import { randomUUID } from "node:crypto";
import { PDFArray, PDFDict, PDFDocument, PDFName } from "pdf-lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptFile, decryptFile } from "@/lib/crypto";

const BUCKET = "documentos";
export const MAX_BYTES = 4 * 1024 * 1024 - 1024; // cabe en el depósito ya cifrado (+32 bytes)

type Actor = { kind: "cliente" | "graduado" | "directora"; id: string | null; ip: string | null };

/** Tipo real por los primeros bytes, no por lo que diga el navegador. */
export function sniff(bytes: Buffer): "image/jpeg" | "application/pdf" | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  return null;
}

/** Rehace el PDF copiando solo las páginas: se quedan fuera JavaScript, adjuntos, formularios y
 *  acciones automáticas del documento. Si no se puede leer, se rechaza. */
async function cleanPdf(bytes: Buffer): Promise<Buffer> {
  const src = await PDFDocument.load(bytes, { ignoreEncryption: false, updateMetadata: false });
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, src.getPageIndices());
  for (const p of pages) {
    // acciones automáticas de la página y de sus anotaciones (enlaces, botones); la apariencia se queda
    p.node.delete(PDFName.of("AA"));
    const annots = p.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
    if (annots) {
      for (let i = 0; i < annots.size(); i++) {
        const a = annots.lookupMaybe(i, PDFDict);
        a?.delete(PDFName.of("A"));
        a?.delete(PDFName.of("AA"));
      }
    }
    out.addPage(p);
  }
  return Buffer.from(await out.save());
}

export class DocError extends Error {}

/** Guarda un documento del caso: valida, limpia, cifra, sube, actualiza la fila y deja registro. */
export async function storeDocument(opts: { caseId: string; docId: string; bytes: Buffer; actor: Actor }) {
  const db = createAdminClient();
  const { data: doc } = await db.from("case_documents").select("id, case_id, status, storage_path, cases(firm_id)").eq("id", opts.docId).single();
  if (!doc || doc.case_id !== opts.caseId) throw new DocError("Ese documento no es de este caso.");
  if (doc.status === "no_aplica") throw new DocError("Ese documento está marcado como «no aplica».");
  if (opts.bytes.length === 0 || opts.bytes.length > MAX_BYTES) throw new DocError("El archivo pesa más de 4 MB. Toma fotos de cada página.");
  const mime = sniff(opts.bytes);
  if (!mime) throw new DocError("Solo recibo fotos o PDF.");
  let plain = opts.bytes;
  if (mime === "application/pdf") {
    try { plain = await cleanPdf(opts.bytes); } catch { throw new DocError("No pude abrir ese PDF. Si tiene contraseña, quítasela o toma fotos de cada página."); }
  }
  const { data, keyVersion, sha256 } = encryptFile(plain);
  const firmId = (doc.cases as unknown as { firm_id: string }).firm_id;
  const path = `${firmId}/${opts.caseId}/${opts.docId}-${randomUUID()}.bin`;
  const up = await db.storage.from(BUCKET).upload(path, data, { contentType: "application/octet-stream", upsert: false });
  if (up.error) throw new DocError("No pude guardar el archivo. Vuelve a intentarlo.");
  const { error } = await db.from("case_documents").update({
    status: "recibido", storage_path: path, mime_type: mime, size_bytes: plain.length, sha256, key_version: keyVersion,
    uploaded_by: opts.actor.kind === "cliente" ? "cliente" : "graduado", uploaded_at: new Date().toISOString(),
  }).eq("id", opts.docId);
  if (error) { await db.storage.from(BUCKET).remove([path]); throw new DocError("No pude guardar el archivo. Vuelve a intentarlo."); }
  if (doc.storage_path) await db.storage.from(BUCKET).remove([doc.storage_path]);
  await logAccess({ actor: opts.actor, caseId: opts.caseId, objectKind: "documento", objectId: opts.docId, action: "subir" });
}

/** Lee y descifra un documento. Quien llama ya comprobó el permiso. */
export async function readDocument(path: string): Promise<Buffer> {
  const { data, error } = await createAdminClient().storage.from(BUCKET).download(path);
  if (error || !data) throw new DocError("No encontré el archivo.");
  return decryptFile(Buffer.from(await data.arrayBuffer()));
}

export async function logAccess(e: { actor: Actor; caseId: string; objectKind: "documento" | "declaracion" | "dato_sensible" | "exportacion"; objectId: string | null; action: "ver" | "descargar" | "subir" | "borrar" | "exportar" | "revelar" }) {
  await createAdminClient().from("access_log").insert({
    actor_id: e.actor.id, actor_kind: e.actor.kind, case_id: e.caseId, object_kind: e.objectKind,
    object_id: e.objectId, action: e.action, ip: e.actor.ip,
  });
}

export function clientIp(h: Headers): string | null {
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip");
  return ip && /^[0-9a-fA-F:.]+$/.test(ip) ? ip : null;
}
