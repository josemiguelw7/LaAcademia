"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { demoAccount, signInDemo } from "@/lib/demo-login";

const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/curso";
};

export async function sendCode(_: unknown, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const next = safeNext(form.get("sigue"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Revisa tu correo: parece que falta algo." };
  if (demoAccount(email)) {
    const home = await signInDemo(email);
    if (!home) return { error: "La demostración está apagada." };
    redirect(home);
  }
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signInWithOtp({
    email, options: { shouldCreateUser: true, emailRedirectTo: `${origin}/auth/callback?sigue=${encodeURIComponent(next)}` },
  });
  if (error) return { error: "No pude enviarte el código. Espera un minuto y vuelve a intentarlo." };
  redirect(`/entrar?correo=${encodeURIComponent(email)}&sigue=${encodeURIComponent(next)}`);
}

export async function verifyCode(_: unknown, form: FormData) {
  const email = String(form.get("email") ?? "");
  const token = String(form.get("token") ?? "").replace(/\D/g, "");
  const next = safeNext(form.get("sigue"));
  if (token.length < 6) return { error: "El código tiene 6 números." };
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { error: "Ese código no coincide o ya venció. Pide uno nuevo." };
  redirect(next);
}

/** Botones de demostración en /entrar. */
export async function demoLogin(form: FormData) {
  const home = await signInDemo(String(form.get("email") ?? ""));
  redirect(home ?? "/entrar");
}
