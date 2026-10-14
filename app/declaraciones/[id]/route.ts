import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { readDeclaration } from "@/lib/declaration";
import { logAccess, clientIp } from "@/lib/doc-storage";

export const runtime = "nodejs";

/** Ver el PDF de una declaración: solo el graduado dueño y Liliana (las reglas de la base deciden). */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await requireViewer();
  const sb = await createClient();
  const { data: r } = await sb.from("return_reviews").select("id, case_id, pdf_path").eq("id", id).maybeSingle();
  if (!r) return new Response("No encontrado", { status: 404 });
  const bytes = await readDeclaration(r.pdf_path);
  await logAccess({ actor: { kind: v.role === "directora" ? "directora" : "graduado", id: v.id, ip: clientIp(req.headers) }, caseId: r.case_id, objectKind: "declaracion", objectId: r.id, action: "ver" });
  return new Response(new Uint8Array(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline", "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" },
  });
}
