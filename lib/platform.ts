import "server-only";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type Firm = { id: string; business_name: string; ptin_last4: string | null; efin_status: string; agreement_signed_at: string | null };

/** Graduado con plataforma. Sin plataforma, de vuelta a su progreso. */
export async function requireGraduate() {
  const v = await requireViewer();
  if (!v.hasPlatform) redirect("/progreso");
  const sb = await createClient();
  const { data: firm } = await sb.from("firms").select("id, business_name, ptin_last4, efin_status, agreement_signed_at").eq("owner_id", v.id).maybeSingle();
  return { v, sb, firm: firm as Firm | null };
}

/** La temporada en curso o la que viene: la más antigua que todavía no se borra. */
export async function currentTaxYear(sb: Awaited<ReturnType<typeof createClient>>): Promise<number | null> {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const { data } = await sb.from("seasons").select("tax_year").gte("purge_on", today).order("tax_year", { ascending: true }).limit(1);
  return data?.[0]?.tax_year ?? null;
}
export { AGREEMENT_VERSION } from "@/lib/agreement";
