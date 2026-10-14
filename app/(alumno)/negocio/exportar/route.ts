import { NextResponse } from "next/server";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { buildSeasonExport } from "@/lib/export";
import { logAccess, clientIp } from "@/lib/doc-storage";

export const runtime = "nodejs";
export const maxDuration = 60;

/** El graduado descarga todo lo de su temporada antes del borrado. */
export async function POST(req: Request) {
  const v = await requireViewer();
  if (!v.hasPlatform) return NextResponse.json({ error: "Sin acceso." }, { status: 403 });
  const sb = await createClient();
  const { data: firm } = await sb.from("firms").select("id").eq("owner_id", v.id).maybeSingle();
  if (!firm) return NextResponse.json({ error: "Primero abre tu negocio." }, { status: 404 });
  const year = Number(new URL(req.url).searchParams.get("year"));
  if (!Number.isInteger(year)) return NextResponse.json({ error: "Falta la temporada." }, { status: 400 });
  try {
    const url = await buildSeasonExport(firm.id, year);
    const { data: anyCase } = await sb.from("cases").select("id").eq("firm_id", firm.id).eq("tax_year", year).limit(1).maybeSingle();
    if (anyCase) await logAccess({ actor: { kind: "graduado", id: v.id, ip: clientIp(req.headers) }, caseId: anyCase.id, objectKind: "exportacion", objectId: null, action: "exportar" });
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "No pude armar el archivo. Vuelve a intentarlo en unos minutos." }, { status: 500 });
  }
}
