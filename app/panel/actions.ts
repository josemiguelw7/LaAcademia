"use server";
import { revalidatePath } from "next/cache";
import { requireViewer } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireStaff() {
  const v = await requireViewer();
  if (!v.isStaff) throw new Error("forbidden");
  return v;
}

export async function grantAccess(_: unknown, form: FormData) {
  await requireStaff();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const plan = String(form.get("plan") ?? "curso");
  const name = String(form.get("name") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Ese correo no parece válido.", ok: null };
  const db = createAdminClient();
  let userId: string | undefined;
  for (let page = 1; page < 50 && !userId; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 200 });
    userId = data.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (data.users.length < 200) break;
  }
  if (!userId) {
    const { data, error } = await db.auth.admin.createUser({ email, email_confirm: true, user_metadata: name ? { full_name: name } : {} });
    if (error) return { error: "No pude crear la cuenta: " + error.message, ok: null };
    userId = data.user.id;
  } else if (name) {
    await db.from("profiles").update({ full_name: name }).eq("id", userId);
  }
  const { data: course } = await db.from("courses").select("id").eq("slug", "preparador-de-impuestos").single();
  const { count } = await db.from("purchases").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "paid");
  if (!count) {
    const { error } = await db.from("purchases").insert({ user_id: userId, course_id: course!.id, plan_id: plan, amount_cents: 0, status: "paid" });
    if (error) return { error: "No pude dar el acceso: " + error.message, ok: null };
  }
  revalidatePath("/panel");
  return { error: null, ok: `Listo: ${email} ya puede entrar con su correo.` };
}

export async function saveCifra(form: FormData) {
  const v = await requireStaff();
  const id = String(form.get("id"));
  const value = Number(String(form.get("value") ?? "").replace(/[$,\s]/g, ""));
  if (!Number.isFinite(value)) return;
  await createAdminClient().from("cifras").update({ value, verified_by: v.id, verified_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/panel/cifras");
}

export async function unverifyCifra(form: FormData) {
  await requireStaff();
  await createAdminClient().from("cifras").update({ verified_by: null, verified_at: null }).eq("id", String(form.get("id")));
  revalidatePath("/panel/cifras");
}
