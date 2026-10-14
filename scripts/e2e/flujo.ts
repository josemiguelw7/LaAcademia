/**
 * Prueba de punta a punta contra una base de PRUEBA (rama de Supabase), nunca contra producción.
 * Recorre el flujo real con las mismas funciones del servidor que usa la app:
 * graduado → cliente → enlace → permiso → documentos → revisión → devolución → aprobación →
 * envío → avisos → exportación → borrado. Al final borra todo lo que creó.
 *
 *   E2E_SUPABASE_URL, E2E_ANON_KEY, E2E_SERVICE_KEY   (de la rama de prueba)
 *   npx tsx --conditions=react-server scripts/e2e/flujo.ts
 */
import { randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { unzipSync, strFromU8 } from "fflate";

const URL_ = process.env.E2E_SUPABASE_URL!, ANON = process.env.E2E_ANON_KEY!, SERVICE = process.env.E2E_SERVICE_KEY!;
if (!URL_ || !ANON || !SERVICE) throw new Error("Faltan E2E_SUPABASE_URL, E2E_ANON_KEY o E2E_SERVICE_KEY");
if (URL_.includes("zfkxrnodryzbjyqrsogh")) throw new Error("Esto es producción. La prueba solo corre contra la rama de prueba.");
process.env.NEXT_PUBLIC_SUPABASE_URL = URL_;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = ANON;
process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE;
process.env.DATA_KEYS = JSON.stringify({ "1": randomBytes(32).toString("base64") });
process.env.DATA_KEY_CURRENT = "1";

let pass = 0, fail = 0;
const ok = (cond: unknown, what: string) => { if (cond) { pass++; console.log(`  ✓ ${what}`); } else { fail++; console.log(`  ✗ ${what}`); } };
const step = (t: string) => console.log(`\n${t}`);

const admin = createClient(URL_, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
const tag = `e2e-${Date.now()}`;
const pwd = randomBytes(18).toString("base64url");
async function user(name: string, role?: string): Promise<{ id: string; sb: SupabaseClient }> {
  const email = `${name}.${tag}@prueba.test`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: pwd, email_confirm: true, user_metadata: { full_name: name } });
  if (error) throw error;
  if (role) await admin.from("profiles").update({ role }).eq("id", data.user.id);
  const sb = createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: e2 } = await sb.auth.signInWithPassword({ email, password: pwd });
  if (e2) throw e2;
  return { id: data.user.id, sb };
}

async function pdfWithJs(text: string) {
  const doc = await PDFDocument.create();
  doc.addPage([300, 300]).drawText(text, { x: 20, y: 150 });
  doc.catalog.set(PDFName.of("OpenAction"), doc.context.obj({ S: "JavaScript", JS: PDFString.of("app.alert('x')") }));
  return Buffer.from(await doc.save({ useObjectStreams: false }));
}
const fakeJpeg = () => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), randomBytes(2000), Buffer.from([0xff, 0xd9])]);

async function main() {
  const { encryptField, decryptField } = await import("@/lib/crypto");
  const { issueIntakeLink, resolveIntake } = await import("@/lib/intake");
  const { syncCase } = await import("@/lib/case-sync");
  const { storeDocument, readDocument } = await import("@/lib/doc-storage");
  const { submitForReview } = await import("@/lib/declaration");
  const { buildSeasonExport, runPurge } = await import("@/lib/export");
  const { CONSENT_VERSION } = await import("@/lib/consent");

  step("Preparación");
  const g = await user("graduada", undefined);
  const other = await user("otra", undefined);
  const lili = await user("liliana", "directora");
  const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
  let { data: course } = await admin.from("courses").select("id").limit(1).maybeSingle();
  if (!course) ({ data: course } = await admin.from("courses").insert({ slug: `prueba-${tag}`, title: "Curso de prueba" }).select("id").single());
  for (const u of [g, other]) await admin.from("purchases").insert({ user_id: u.id, course_id: course!.id, plan_id: "mentoria", amount_cents: 0, status: "paid" });
  ok(true, "usuarios de prueba creados");

  step("1. El graduado abre su negocio y su primer cliente");
  const { data: firm, error: fe } = await g.sb.from("firms").insert({ owner_id: g.id, business_name: "Impuestos Prueba", agreement_version: "provisional-2026-10", agreement_signed_at: new Date().toISOString() }).select("id").single();
  ok(!fe && firm, "firma creada con su propia sesión");
  const ssnEnc = encryptField("123456789");
  const { data: client } = await g.sb.from("clients").insert({ firm_id: firm!.id, full_name: "María Prueba", ssn_enc: ssnEnc, ssn_last4: "6789" }).select("id, ssn_enc").single();
  ok(client && client.ssn_enc !== "123456789" && decryptField(client.ssn_enc!) === "123456789", "el SSN se guarda cifrado y se descifra");
  const { data: kase } = await g.sb.from("cases").insert({ firm_id: firm!.id, client_id: client!.id, tax_year: 2026 }).select("id").single();
  ok(kase, "caso abierto para 2026");
  const caseId = kase!.id;

  step("2. Reglas de acceso");
  const { data: seen } = await other.sb.from("cases").select("id").eq("id", caseId);
  ok(seen?.length === 0, "otro graduado no ve el caso");
  const { data: seenL } = await lili.sb.from("cases").select("id").eq("id", caseId);
  ok(seenL?.length === 0, "Liliana no lo ve antes de que se mande a revisión");
  const { data: seenA } = await anon.from("firms").select("id");
  ok((seenA ?? []).length === 0, "sin sesión no se ve nada");
  const { error: selfApprove } = await g.sb.from("cases").update({ status: "aprobada" }).eq("id", caseId);
  ok(!!selfApprove, "el graduado no puede ponerse «aprobada»");

  step("3. Cuestionario y lista de documentos");
  await syncCase(g.sb, caseId, { estado_civil: "soltero", dependientes: 0, w2: 1, propio: false, intereses: false, desempleo: false, seguro_social: false, retiro: false, mercado: true, estudios: false, hipoteca: false, acciones: false }, true);
  const { data: docs } = await g.sb.from("case_documents").select("id, kind, label, status").eq("case_id", caseId);
  ok(docs?.length === 3 && docs.every((d) => d.status === "esperado"), "pide identificación, W-2 y 1095-A");

  step("4. Enlace del cliente y permiso");
  const token = await issueIntakeLink(caseId);
  let intake = await resolveIntake(token);
  ok(intake && !intake.consented, "el enlace abre el caso; todavía sin permiso");
  ok((await resolveIntake(token.slice(0, -2) + "xx")) === null, "un enlace alterado no abre nada");
  await admin.from("consents").insert({ case_id: caseId, kind: "7216_divulgar", text_version: CONSENT_VERSION, signer_name: "María Prueba" });
  intake = await resolveIntake(token);
  ok(intake?.consented, "permiso firmado");
  const newer = await issueIntakeLink(caseId);
  ok((await resolveIntake(token)) === null && (await resolveIntake(newer)) !== null, "crear otro enlace revoca el anterior");

  step("5. El cliente sube documentos");
  const w2 = docs!.find((d) => d.kind === "w2")!;
  const idDoc = docs!.find((d) => d.kind === "identificacion")!;
  await storeDocument({ caseId, docId: idDoc.id, bytes: fakeJpeg(), actor: { kind: "cliente", id: null, ip: null } });
  await storeDocument({ caseId, docId: w2.id, bytes: await pdfWithJs("W-2 de prueba"), actor: { kind: "cliente", id: null, ip: null } });
  const { data: after } = await g.sb.from("case_documents").select("id, status, storage_path").eq("case_id", caseId);
  ok(after?.filter((d) => d.status === "recibido").length === 2, "dos documentos recibidos");
  const w2Path = after!.find((d) => d.id === w2.id)!.storage_path!;
  const raw = await admin.storage.from("documentos").download(w2Path);
  const rawBytes = Buffer.from(await raw.data!.arrayBuffer());
  ok(!rawBytes.toString("latin1").includes("%PDF"), "en el depósito el archivo está cifrado");
  const clean = await readDocument(w2Path);
  ok(clean.toString("latin1").startsWith("%PDF") && !clean.toString("latin1").includes("JavaScript"), "descifrado es un PDF sin JavaScript");
  const { error: directDl } = await other.sb.storage.from("documentos").download(w2Path);
  ok(!!directDl, "nadie puede bajar el archivo directo del depósito");
  let bad = false; try { await storeDocument({ caseId, docId: w2.id, bytes: Buffer.from("<html>no</html>"), actor: { kind: "cliente", id: null, ip: null } }); } catch { bad = true; }
  ok(bad, "rechaza lo que no es foto ni PDF");

  step("6. Revisión: devuelta y luego aprobada");
  await submitForReview({ sb: g.sb, caseId, userId: g.id, bytes: await pdfWithJs("Declaración v1") });
  const { data: c1 } = await g.sb.from("cases").select("status, score, score_reasons").eq("id", caseId).single();
  ok(c1?.status === "en_revision" && typeof c1.score === "number", `en revisión con puntaje ${c1?.score}`);
  const { data: seenL2 } = await lili.sb.from("cases").select("id").eq("id", caseId);
  ok(seenL2?.length === 1, "ahora Liliana sí ve el caso");
  const { data: r1 } = await lili.sb.from("return_reviews").select("id").eq("case_id", caseId).single();
  const { error: ge } = await g.sb.from("return_reviews").update({ decision: "aprobada" }).eq("id", r1!.id).select("id");
  const { data: stillOpen } = await admin.from("return_reviews").select("decision").eq("id", r1!.id).single();
  ok(stillOpen?.decision === null, `el graduado no puede autoaprobarse${ge ? "" : " (sin error, cero filas)"}`);
  await lili.sb.from("return_reviews").update({ decision: "devuelta", notes: "Falta el 1095-A" }).eq("id", r1!.id);
  const { data: c2 } = await g.sb.from("cases").select("status").eq("id", caseId).single();
  ok(c2?.status === "devuelta", "Liliana la devuelve con notas");
  await submitForReview({ sb: g.sb, caseId, userId: g.id, bytes: await pdfWithJs("Declaración v2") });
  const { data: r2 } = await lili.sb.from("return_reviews").select("id, version").eq("case_id", caseId).eq("version", 2).single();
  ok(r2?.version === 2, "segunda versión enviada");
  await lili.sb.from("return_reviews").update({ decision: "aprobada" }).eq("id", r2!.id);
  await g.sb.from("cases").update({ status: "enviada", filed_at: new Date().toISOString() }).eq("id", caseId);
  const { data: c3 } = await g.sb.from("cases").select("status").eq("id", caseId).single();
  ok(c3?.status === "enviada", "aprobada y marcada como enviada");
  const { data: q } = await g.sb.from("firm_review_quota").select("used, allowed").eq("firm_id", firm!.id).eq("tax_year", 2026).single();
  ok(q?.used === 1 && q.allowed === 15, "el cupo cuenta el caso una sola vez (1 de 15)");

  step("7. Avisos");
  const { data: gn } = await g.sb.from("notifications").select("kind");
  const kinds = new Set((gn ?? []).map((n) => n.kind));
  ok(kinds.has("permiso_firmado") && kinds.has("documento_recibido") && kinds.has("revision_devuelta") && kinds.has("revision_aprobada"), "el graduado recibió permiso, documento, devuelta y aprobada");
  const { data: ln } = await lili.sb.from("notifications").select("kind");
  ok((ln ?? []).filter((n) => n.kind === "revision_nueva").length === 2, "Liliana recibió las dos declaraciones");
  const { data: on } = await other.sb.from("notifications").select("id");
  ok((on ?? []).length === 0, "la otra graduada no ve avisos ajenos");

  step("8. Registro de accesos");
  const { data: logs } = await g.sb.from("access_log").select("action, object_kind").eq("case_id", caseId);
  ok((logs ?? []).filter((l) => l.action === "subir").length >= 4, "cada subida quedó registrada");

  step("9. Exportación de fin de temporada");
  const url = await buildSeasonExport(firm!.id, 2026);
  const zipRes = await fetch(url);
  const files = unzipSync(new Uint8Array(await zipRes.arrayBuffer()));
  const names = Object.keys(files);
  ok(names.includes("resumen.csv") && names.some((n) => n.endsWith("declaracion v2.pdf")) && names.some((n) => n.includes("/documentos/")), `zip con ${names.length} archivos`);
  ok(strFromU8(files["resumen.csv"]).includes("María Prueba") && !strFromU8(files["resumen.csv"]).includes("123456789"), "el resumen no lleva el SSN completo");

  step("10. Borrado de temporada");
  const report = await runPurge("2099-12-31");
  const { data: gone } = await admin.from("cases").select("id").eq("id", caseId);
  // se revisa la lista del depósito: una descarga recién borrada puede salir todavía de la caché
  const folder = w2Path.split("/").slice(0, -1).join("/");
  const { data: left } = await admin.storage.from("documentos").list(folder);
  ok(report.seasons.includes(2026) && gone?.length === 0 && (left ?? []).length === 0, `casos y archivos borrados (${report.files} archivos)`);
  const { data: logsLeft } = await admin.from("access_log").select("id").is("case_id", null);
  ok((logsLeft ?? []).length > 0, "el registro de accesos se conserva sin la referencia");

  step("Limpieza");
  await admin.from("firms").delete().eq("id", firm!.id);
  for (const u of [g, other, lili]) await admin.auth.admin.deleteUser(u.id);
  ok(true, "usuarios y datos de prueba borrados");

  console.log(`\n${pass} correctas, ${fail} fallidas`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("\nError:", e); process.exit(1); });
