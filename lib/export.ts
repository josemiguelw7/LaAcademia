import "server-only";
import { zipSync, strToU8 } from "fflate";
import { createAdminClient } from "@/lib/supabase/admin";
import { readDocument } from "@/lib/doc-storage";
import { readDeclaration } from "@/lib/declaration";
import { DOC_KINDS } from "@/lib/documents";

const safe = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9 ._-]/g, "").trim().slice(0, 60) || "sin-nombre";
const csv = (rows: (string | number | null)[][]) => rows.map((r) => r.map((v) => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");

/** Arma el archivo de la temporada de una firma: documentos y declaraciones descifrados, y un resumen.
 *  Lo sube al depósito temporal y devuelve un enlace firmado de 10 minutos. */
export async function buildSeasonExport(firmId: string, taxYear: number): Promise<string> {
  const db = createAdminClient();
  const { data: cases } = await db.from("cases")
    .select("id, status, filed_at, clients(full_name, ssn_last4), case_documents(id, kind, label, status, storage_path, mime_type), return_reviews(id, version, pdf_path, decision, notes)")
    .eq("firm_id", firmId).eq("tax_year", taxYear);
  const files: Record<string, Uint8Array> = {};
  const summary: (string | number | null)[][] = [["Cliente", "SSN/ITIN (últimos 4)", "Estado", "Enviada", "Documentos recibidos", "Versiones revisadas", "Última decisión"]];
  for (const c of cases ?? []) {
    const client = c.clients as unknown as { full_name: string; ssn_last4: string | null };
    const folder = `${safe(client.full_name)} (${c.id.slice(0, 6)})`;
    const docs = (c.case_documents ?? []) as { id: string; kind: string; label: string | null; storage_path: string | null; mime_type: string | null }[];
    let n = 0;
    for (const d of docs.filter((x) => x.storage_path)) {
      const ext = d.mime_type === "application/pdf" ? "pdf" : "jpg";
      files[`${folder}/documentos/${++n} ${safe(d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind)}.${ext}`] = new Uint8Array(await readDocument(d.storage_path!));
    }
    const reviews = [...((c.return_reviews ?? []) as { version: number; pdf_path: string; decision: string | null; notes: string | null }[])].sort((a, b) => a.version - b.version);
    for (const r of reviews) files[`${folder}/declaracion v${r.version}.pdf`] = new Uint8Array(await readDeclaration(r.pdf_path));
    const last = reviews.at(-1);
    summary.push([client.full_name, client.ssn_last4, c.status, c.filed_at?.slice(0, 10) ?? null, n, reviews.length, last ? `${last.decision ?? "pendiente"}${last.notes ? ` — ${last.notes}` : ""}` : null]);
  }
  files["resumen.csv"] = strToU8("\uFEFF" + csv(summary));
  files["LEEME.txt"] = strToU8(`Archivo de la temporada ${taxYear}.\nGuárdalo en un lugar seguro y cifrado: contiene datos fiscales de tus clientes.\nLa ley te pide conservar copia de cada declaración que preparas por lo menos tres años.\n`);
  const zip = zipSync(files, { level: 0 });
  const path = `${firmId}/${taxYear}-${Date.now()}.zip`;
  const up = await db.storage.from("exportaciones").upload(path, zip, { contentType: "application/zip", upsert: false });
  if (up.error) throw new Error("no_se_subio_la_exportacion");
  const { data: signed } = await db.storage.from("exportaciones").createSignedUrl(path, 600, { download: `temporada-${taxYear}.zip` });
  if (!signed?.signedUrl) throw new Error("no_se_firmo_el_enlace");
  return signed.signedUrl;
}

/** Borrado de fin de temporada y limpieza de exportaciones viejas. Lo llama el cron diario. */
export async function runPurge(today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" })) {
  const db = createAdminClient();
  const report = { seasons: [] as number[], files: 0, cases: 0, exports: 0 };

  const { data: due } = await db.from("seasons").select("tax_year").lte("purge_on", today);
  for (const s of due ?? []) {
    const { data: cases } = await db.from("cases").select("id, client_id, case_documents(storage_path), return_reviews(pdf_path)").eq("tax_year", s.tax_year);
    if (!cases?.length) continue;
    report.seasons.push(s.tax_year);
    const docPaths = cases.flatMap((c) => ((c.case_documents ?? []) as { storage_path: string | null }[]).map((d) => d.storage_path).filter(Boolean) as string[]);
    const pdfPaths = cases.flatMap((c) => ((c.return_reviews ?? []) as { pdf_path: string }[]).map((r) => r.pdf_path));
    for (let i = 0; i < docPaths.length; i += 100) await db.storage.from("documentos").remove(docPaths.slice(i, i + 100));
    for (let i = 0; i < pdfPaths.length; i += 100) await db.storage.from("declaraciones").remove(pdfPaths.slice(i, i + 100));
    report.files += docPaths.length + pdfPaths.length;
    const ids = cases.map((c) => c.id);
    await db.from("cases").delete().in("id", ids);
    report.cases += ids.length;
    // clientes que ya no tienen ningún caso: también se van, con su SSN cifrado
    const clientIds = [...new Set(cases.map((c) => c.client_id))];
    const { data: still } = await db.from("cases").select("client_id").in("client_id", clientIds);
    const keep = new Set((still ?? []).map((r) => r.client_id));
    const drop = clientIds.filter((id) => !keep.has(id));
    if (drop.length) await db.from("clients").delete().in("id", drop);
    await db.from("access_log").insert({ actor_kind: "sistema", object_kind: "exportacion", action: "borrar" });
  }

  // exportaciones de más de un día
  const { data: firms } = await db.storage.from("exportaciones").list("", { limit: 1000 });
  const cutoff = Date.now() - 864e5;
  for (const f of firms ?? []) {
    const { data: items } = await db.storage.from("exportaciones").list(f.name, { limit: 1000 });
    const old = (items ?? []).filter((it) => Number(it.name.split("-").pop()?.replace(".zip", "")) < cutoff).map((it) => `${f.name}/${it.name}`);
    if (old.length) { await db.storage.from("exportaciones").remove(old); report.exports += old.length; }
  }
  return report;
}
