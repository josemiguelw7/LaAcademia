import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Viewer = { id: string; email: string; fullName: string | null; role: "alumno" | "directora" | "admin"; hasAccess: boolean; isStaff: boolean; hasPlatform: boolean };

/** Current user + role + course access. Redirects to /entrar when signed out. */
export async function requireViewer(): Promise<Viewer> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("full_name, role").eq("id", user.id).single();
  const role = (profile?.role ?? "alumno") as Viewer["role"];
  const isStaff = role === "directora" || role === "admin";
  const [{ data: paid }, { data: subs }, { data: platformPlans }] = await Promise.all([
    admin.from("purchases").select("plan_id").eq("user_id", user.id).eq("status", "paid"),
    admin.from("subscriptions").select("plan_id").eq("user_id", user.id).in("status", ["active", "past_due"]).gt("current_period_end", new Date().toISOString()),
    admin.from("plans").select("id").eq("has_platform", true),
  ]);
  const withPlatform = new Set((platformPlans ?? []).map((p) => p.id as string));
  const hasAccess = isStaff || (paid ?? []).length > 0 || (subs ?? []).length > 0;
  // la plataforma del graduado: compra o suscripción vigente de un plan con plataforma (no la da ser staff)
  const hasPlatform = [...(paid ?? []), ...(subs ?? [])].some((r) => withPlatform.has(r.plan_id as string));
  return { id: user.id, email: user.email ?? "", fullName: profile?.full_name ?? null, role, hasAccess, isStaff, hasPlatform };
}
