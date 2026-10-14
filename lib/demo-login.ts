import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { DEMO_ACCOUNTS, getDemoState, seedDemo } from "@/lib/demo-seed";

/**
 * Entrada sin código para las tres cuentas de demostración, solo mientras la demostración esté encendida.
 * «Borrar la demostración» en el panel la apaga: desde ese momento esos correos ya no entran.
 */
const OFF_KEY = "demo_apagada";

export async function demoEnabled(): Promise<boolean> {
  const { data } = await createAdminClient().from("settings").select("value").eq("key", OFF_KEY).maybeSingle();
  return data?.value !== true;
}

export async function setDemoEnabled(on: boolean) {
  await createAdminClient().from("settings").upsert({ key: OFF_KEY, value: !on });
}

export const demoAccount = (email: string) => DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase()) ?? null;

/** Inicia la sesión de una cuenta de demostración (y carga los datos la primera vez). Devuelve a dónde ir. */
export async function signInDemo(email: string): Promise<string | null> {
  const account = demoAccount(email);
  if (!account || !(await demoEnabled())) return null;
  if (!(await getDemoState())) await seedDemo();
  const { data, error } = await createAdminClient().auth.admin.generateLink({ type: "magiclink", email: account.email });
  if (error || !data.properties?.hashed_token) return null;
  const supabase = await createClient();
  const { error: e2 } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: data.properties.hashed_token });
  return e2 ? null : account.home;
}
