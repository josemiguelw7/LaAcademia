import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptField } from "@/lib/crypto";
import { syncCase } from "@/lib/case-sync";
import { storeDocument } from "@/lib/doc-storage";
import { submitForReview } from "@/lib/declaration";
import { CONSENT_VERSION } from "@/lib/consent";
import type { Answers } from "@/lib/questionnaire";

/**
 * Cuentas y datos de demostración para recorrer la plataforma. Todo lleva «Ejemplo» o «Demo» en el nombre,
 * los documentos son PDF que dicen que no son reales y los números de Seguro Social son de prueba (900-…).
 * Las cuentas usan el correo del admin con +etiqueta, así los códigos de entrada le llegan a él.
 */
const KEY = "demo_cuentas";
export type DemoState = { users: { role: string; email: string; id: string }[]; firmId: string | null; createdAt: string };

export const demoEmail = (base: string, tag: string) => {
  const [local, domain] = base.split("@");
  return `${local.split("+")[0]}+${tag}@${domain}`;
};

export async function getDemoState(): Promise<DemoState | null> {
  const { data } = await createAdminClient().from("settings").select("value").eq("key", KEY).maybeSingle();
  return (data?.value as DemoState | undefined) ?? null;
}

async function samplePdf(title: string, lines: string[]): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 396]);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawRectangle({ x: 24, y: 24, width: 564, height: 348, borderColor: rgb(0.6, 0.45, 0.3), borderWidth: 1.5 });
  page.drawText(title, { x: 44, y: 330, size: 20, font: bold, color: rgb(0.11, 0.106, 0.098) });
  page.drawText("EJEMPLO DE DEMOSTRACIÓN · NO ES UN DOCUMENTO REAL".normalize("NFD").replace(/[\u0300-\u036f]/g, ""), { x: 44, y: 304, size: 10, font: bold, color: rgb(0.7, 0.2, 0.2) });
  lines.forEach((l, i) => page.drawText(l.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), { x: 44, y: 270 - i * 22, size: 12, font }));
  return Buffer.from(await doc.save());
}

const DOC_SAMPLES: Record<string, (who: string) => Promise<Buffer>> = {
  identificacion: (who) => samplePdf("Identificacion con foto", [`Nombre: ${who}`, "Licencia de manejo de Texas (ejemplo)", "Vence: 2029"]),
  w2: (who) => samplePdf("Formulario W-2", [`Empleado: ${who}`, "Empleador: Restaurante El Ejemplo LLC", "Casilla 1 (salarios): $31,450.00", "Casilla 2 (retencion federal): $2,180.00"]),
  "1099-int": (who) => samplePdf("Formulario 1099-INT", [`Beneficiario: ${who}`, "Banco Ejemplo", "Casilla 1 (intereses): $42.17"]),
  "1099-nec": (who) => samplePdf("Formulario 1099-NEC", [`Beneficiario: ${who}`, "Pagador: Limpiezas Demo Inc.", "Casilla 1: $18,900.00"]),
  "1095-a": (who) => samplePdf("Formulario 1095-A", [`Asegurada: ${who}`, "Mercado de seguros (ejemplo)", "12 meses de cobertura"]),
  "1098-t": (who) => samplePdf("Formulario 1098-T", [`Estudiante: ${who}`, "Austin Community College (ejemplo)", "Casilla 1: $3,200.00", "Casilla 5 (becas): $1,500.00"]),
};

type ClientPlan = { name: string; ssn: string; answers: Answers; receive: string[]; consent: boolean; review?: { decision?: "aprobada" | "devuelta"; notes?: string; filed?: boolean; resubmit?: boolean } };

const CLIENTS: ClientPlan[] = [
  { name: "María Ejemplo", ssn: "900111234", consent: true, receive: ["identificacion", "w2", "1099-int"],
    answers: { estado_civil: "soltero", dependientes: 1, w2: 1, propio: false, intereses: true, desempleo: false, seguro_social: false, retiro: false, mercado: false, estudios: false, hipoteca: false, acciones: false },
    review: { decision: "aprobada", filed: true } },
  { name: "Ana Ejemplo", ssn: "900225678", consent: true, receive: ["identificacion", "w2", "1098-t"],
    answers: { estado_civil: "soltero", dependientes: 0, w2: 1, propio: false, intereses: false, desempleo: false, seguro_social: false, retiro: false, mercado: false, estudios: true, hipoteca: false, acciones: false },
    review: { decision: "devuelta", notes: "En la 1098-T hay $1,500 de becas en la casilla 5. Réstalas de la colegiatura antes de calcular el crédito y mándamela otra vez." } },
  { name: "Rosa Ejemplo", ssn: "900339012", consent: true, receive: ["identificacion", "w2", "1099-nec", "1095-a"],
    answers: { estado_civil: "casado", dependientes: 2, w2: 1, propio: true, intereses: false, desempleo: false, seguro_social: false, retiro: false, mercado: true, estudios: false, hipoteca: false, acciones: false },
    review: {} },
  { name: "Carlos Ejemplo", ssn: "900443456", consent: false, receive: [],
    answers: { estado_civil: "casado", dependientes: 0, w2: 2, propio: false, intereses: false, desempleo: false, seguro_social: false, retiro: false, mercado: false, estudios: false, hipoteca: true, acciones: false } },
];

async function ensureUser(email: string, fullName: string): Promise<string> {
  const db = createAdminClient();
  for (let page = 1; page <= 10; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
    const found = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (!data || data.users.length < 200) break;
  }
  const { data, error } = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: { full_name: fullName } });
  if (error || !data.user) throw new Error(`no_se_creo_${email}`);
  return data.user.id;
}

export async function seedDemo(adminEmail: string): Promise<DemoState> {
  await clearDemo();
  const db = createAdminClient();
  const { data: course } = await db.from("courses").select("id").limit(1).single();
  const { data: season } = await db.from("seasons").select("tax_year").order("tax_year", { ascending: true }).limit(1).single();
  const year = season!.tax_year as number;

  const alumna = { role: "alumna", email: demoEmail(adminEmail, "alumna"), id: "" };
  const graduada = { role: "graduada", email: demoEmail(adminEmail, "graduada"), id: "" };
  const liliana = { role: "directora", email: demoEmail(adminEmail, "liliana"), id: "" };
  alumna.id = await ensureUser(alumna.email, "Alumna Demo");
  graduada.id = await ensureUser(graduada.email, "Graduada Demo");
  liliana.id = await ensureUser(liliana.email, "Liliana Demo");
  await db.from("profiles").update({ full_name: "Alumna Demo" }).eq("id", alumna.id);
  await db.from("profiles").update({ full_name: "Graduada Demo" }).eq("id", graduada.id);
  await db.from("profiles").update({ full_name: "Liliana Demo", role: "directora" }).eq("id", liliana.id);

  await db.from("purchases").insert([
    { user_id: alumna.id, course_id: course!.id, plan_id: "soporte", amount_cents: 0, status: "paid" },
    { user_id: graduada.id, course_id: course!.id, plan_id: "mentoria", amount_cents: 0, status: "paid" },
  ]);

  // avance en el curso: la alumna va en el módulo 3; la graduada lo terminó
  const { data: mods } = await db.from("modules").select("position, lessons(id, code, position)").eq("course_id", course!.id).order("position");
  const lessons = (mods ?? []).flatMap((m) => [...(m.lessons ?? [])].sort((a, b) => a.position - b.position));
  const now = Date.now();
  const progress = (uid: string, done: number) => lessons.slice(0, done + 1).map((l, i) => i < done
    ? { user_id: uid, lesson_id: l.id, status: "dominada", best_score: 80 + ((i * 7) % 21), last_score: 80 + ((i * 7) % 21), attempts: 1 + (i % 3), mastered_at: new Date(now - (done - i) * 864e5).toISOString() }
    : { user_id: uid, lesson_id: l.id, status: "en_progreso", best_score: 60, last_score: 60, attempts: 1, mastered_at: null });
  await db.from("lesson_progress").insert(progress(alumna.id, 8));
  await db.from("lesson_progress").insert(progress(graduada.id, lessons.length).slice(0, lessons.length));
  await db.from("prep_steps").insert(["ptin", "eservices"].map((step) => ({ user_id: alumna.id, step })));
  await db.from("prep_steps").insert(["ptin", "eservices", "efin_solicitud", "huellas", "efin_aprobado", "taxact", "plan_seguridad"].map((step) => ({ user_id: graduada.id, step })));

  // el negocio de la graduada y sus cuatro clientes
  const { data: firm } = await db.from("firms").insert({
    owner_id: graduada.id, business_name: "Impuestos Demo", ptin_last4: "0000", efin_status: "aprobado",
    agreement_version: "provisional-2026-10", agreement_signed_at: new Date().toISOString(),
  }).select("id").single();
  const actor = { kind: "cliente" as const, id: null, ip: null };
  for (const plan of CLIENTS) {
    const { data: client } = await db.from("clients").insert({
      firm_id: firm!.id, full_name: plan.name, email: demoEmail(adminEmail, plan.name.split(" ")[0].toLowerCase()),
      ssn_enc: encryptField(plan.ssn), ssn_last4: plan.ssn.slice(-4),
    }).select("id").single();
    const { data: kase } = await db.from("cases").insert({ firm_id: firm!.id, client_id: client!.id, tax_year: year }).select("id").single();
    const caseId = kase!.id as string;
    await syncCase(db, caseId, plan.answers, true);
    if (plan.consent) await db.from("consents").insert({ case_id: caseId, kind: "7216_divulgar", text_version: CONSENT_VERSION, signer_name: plan.name });
    const { data: docs } = await db.from("case_documents").select("id, kind").eq("case_id", caseId);
    const toReceive = [...plan.receive];
    for (const d of docs ?? []) {
      if (!toReceive.includes(d.kind)) continue;
      await storeDocument({ caseId, docId: d.id, bytes: await DOC_SAMPLES[d.kind](plan.name), actor });
      toReceive.splice(toReceive.indexOf(d.kind), 1);
    }
    if (plan.review) {
      await submitForReview({ sb: db, caseId, userId: graduada.id, bytes: await samplePdf("Formulario 1040 (borrador de TaxAct)", [`Contribuyente: ${plan.name}`, `Año fiscal ${year}`, "Preparado por: Impuestos Demo"]) });
      if (plan.review.decision) {
        const { data: r } = await db.from("return_reviews").select("id").eq("case_id", caseId).is("decision", null).single();
        await db.from("return_reviews").update({ decision: plan.review.decision, notes: plan.review.notes ?? null, decided_by: liliana.id }).eq("id", r!.id);
      }
      if (plan.review.filed) await db.from("cases").update({ status: "enviada", filed_at: new Date().toISOString() }).eq("id", caseId);
    }
  }

  const state: DemoState = { users: [alumna, graduada, liliana], firmId: firm!.id, createdAt: new Date().toISOString() };
  await db.from("settings").upsert({ key: KEY, value: state });
  return state;
}

/** Borra todo lo de demostración: archivos, negocio y cuentas. */
export async function clearDemo() {
  const db = createAdminClient();
  const state = await getDemoState();
  if (!state) return;
  if (state.firmId) {
    const { data: cases } = await db.from("cases").select("id, case_documents(storage_path), return_reviews(pdf_path)").eq("firm_id", state.firmId);
    const docs = (cases ?? []).flatMap((c) => ((c.case_documents ?? []) as { storage_path: string | null }[]).map((d) => d.storage_path).filter(Boolean) as string[]);
    const pdfs = (cases ?? []).flatMap((c) => ((c.return_reviews ?? []) as { pdf_path: string }[]).map((r) => r.pdf_path));
    if (docs.length) await db.storage.from("documentos").remove(docs);
    if (pdfs.length) await db.storage.from("declaraciones").remove(pdfs);
    await db.from("cases").delete().eq("firm_id", state.firmId);
    await db.from("clients").delete().eq("firm_id", state.firmId);
    await db.from("firms").delete().eq("id", state.firmId);
  }
  for (const u of state.users) await db.auth.admin.deleteUser(u.id);
  await db.from("settings").delete().eq("key", KEY);
}
