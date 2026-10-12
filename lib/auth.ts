import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Viewer = { id: string; email: string; fullName: string | null; role: "alumno" | "directora" | "admin"; hasAccess: boolean; isStaff: boolean };

/** Current user + role + course access. Redirects to /entrar when signed out. */
export async function requireViewer(): Promise<Viewer> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("full_name, role").eq("id", user.id).single();
  const role = (profile?.role ?? "alumno") as Viewer["role"];
  const isStaff = role === "directora" || role === "admin";
  let hasAccess = isStaff;
  if (!hasAccess) {
    const { count } = await admin.from("purchases").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "paid");
    hasAccess = (count ?? 0) > 0;
  }
  return { id: user.id, email: user.email ?? "", fullName: profile?.full_name ?? null, role, hasAccess, isStaff };
}
