import { NextResponse } from "next/server";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { storeDocument, DocError, clientIp } from "@/lib/doc-storage";

export const runtime = "nodejs";

/** El graduado sube un documento de su cliente (por ejemplo, si se lo dio en papel). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await requireViewer();
  if (!v.hasPlatform) return NextResponse.json({ error: "Sin acceso." }, { status: 403 });
  const sb = await createClient();
  const { data: c } = await sb.from("cases").select("id, firms!inner(owner_id)").eq("id", id).eq("firms.owner_id", v.id).maybeSingle();
  if (!c) return NextResponse.json({ error: "Ese caso no es tuyo." }, { status: 404 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "No llegó el archivo." }, { status: 400 });
  try {
    await storeDocument({ caseId: id, docId: String(form.get("doc_id") ?? ""), bytes: Buffer.from(await file.arrayBuffer()), actor: { kind: "graduado", id: v.id, ip: clientIp(req.headers) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof DocError ? e.message : "No se pudo subir. Vuelve a intentarlo." }, { status: 400 });
  }
}
