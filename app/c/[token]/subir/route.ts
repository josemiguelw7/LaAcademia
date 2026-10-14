import { NextResponse } from "next/server";
import { resolveIntake } from "@/lib/intake";
import { storeDocument, DocError, clientIp } from "@/lib/doc-storage";

export const runtime = "nodejs";

/** El cliente sube un documento con su enlace. Requiere consentimiento firmado. */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const intake = await resolveIntake(token);
  if (!intake) return NextResponse.json({ error: "Este enlace ya no funciona. Pídele uno nuevo a tu preparadora." }, { status: 404 });
  if (!intake.consented) return NextResponse.json({ error: "Primero necesito tu permiso, arriba en esta página." }, { status: 403 });
  const form = await req.formData();
  const docId = String(form.get("doc_id") ?? "");
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "No llegó el archivo." }, { status: 400 });
  try {
    await storeDocument({ caseId: intake.caseId, docId, bytes: Buffer.from(await file.arrayBuffer()), actor: { kind: "cliente", id: null, ip: clientIp(req.headers) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof DocError ? e.message : "No se pudo subir. Vuelve a intentarlo." }, { status: 400 });
  }
}
