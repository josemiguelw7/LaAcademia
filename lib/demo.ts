import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** La lección abierta como demo (settings.demo_lesson_code). null = demo apagada. */
export async function getDemoCode(): Promise<string | null> {
  const { data } = await createAdminClient().from("settings").select("value").eq("key", "demo_lesson_code").maybeSingle();
  return typeof data?.value === "string" && data.value ? data.value : null;
}
