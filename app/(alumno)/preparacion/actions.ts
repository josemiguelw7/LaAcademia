"use server";
import { revalidatePath } from "next/cache";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PREP_STEPS, type PrepStepId } from "@/lib/prep";

/** Marca o desmarca un paso. Usa la sesión del alumno: las reglas de acceso de la base aplican. */
export async function togglePrepStep(form: FormData) {
  const v = await requireViewer();
  const step = String(form.get("step")) as PrepStepId;
  if (!PREP_STEPS.some((s) => s.id === step)) throw new Error("paso_desconocido");
  const done = form.get("done") === "1";
  const sb = await createClient();
  if (done) {
    await sb.from("prep_steps").delete().eq("user_id", v.id).eq("step", step);
  } else {
    await sb.from("prep_steps").upsert({ user_id: v.id, step }, { onConflict: "user_id,step" });
  }
  revalidatePath("/preparacion");
}
