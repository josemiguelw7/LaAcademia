import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { submitForReview } from "@/lib/declaration";
import { DocError } from "@/lib/doc-storage";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await requireViewer();
  if (!v.hasPlatform) return NextResponse.json({ error: "Sin acceso." }, { status: 403 });
  const sb = await createClient();
  const { data: c } = await sb.from("cases").select("id, firms!inner(owner_id)").eq("id", id).eq("firms.owner_id", v.id).maybeSingle();
  if (!c) return NextResponse.json({ error: "Ese caso no es tuyo." }, { status: 404 });
  const file = (await req.formData()).get("file");
  if (!(file instanceof Blob)) return NextResponse.json({ error: "No llegó el archivo." }, { status: 400 });
  try {
    await submitForReview({ sb, caseId: id, userId: v.id, bytes: Buffer.from(await file.arrayBuffer()) });
    revalidatePath(`/negocio/casos/${id}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof DocError ? e.message : "No pude mandarla a revisión." }, { status: 400 });
  }
}
