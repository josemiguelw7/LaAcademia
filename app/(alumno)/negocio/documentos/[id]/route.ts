import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { readDocument, logAccess, clientIp } from "@/lib/doc-storage";

export const runtime = "nodejs";

/** Ver un documento: las reglas de acceso de la base deciden si existe para quien lo pide;
 *  el servidor lo descifra al momento y deja registro. Nunca queda en caché. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const v = await requireViewer();
  const sb = await createClient();
  const { data: d } = await sb.from("case_documents").select("id, case_id, storage_path, mime_type").eq("id", id).maybeSingle();
  if (!d?.storage_path) return new Response("No encontrado", { status: 404 });
  const bytes = await readDocument(d.storage_path);
  await logAccess({ actor: { kind: v.role === "directora" ? "directora" : "graduado", id: v.id, ip: clientIp(req.headers) }, caseId: d.case_id, objectKind: "documento", objectId: d.id, action: "ver" });
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": d.mime_type ?? "application/octet-stream",
      "Content-Disposition": "inline",
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
