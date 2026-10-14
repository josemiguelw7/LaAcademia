"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type State = { error: string | null } | null;

/** Aprobar o devolver. Las reglas de la base aseguran que solo la directora decide, una sola vez. */
export async function decide(reviewId: string, _: State, form: FormData): Promise<State> {
  const v = await requireViewer();
  if (v.role !== "directora") return { error: "Solo Liliana decide las revisiones." };
  const decision = form.get("decision") === "aprobada" ? "aprobada" : "devuelta";
  const notes = String(form.get("notes") ?? "").trim().slice(0, 4000) || null;
  if (decision === "devuelta" && !notes) return { error: "Para devolverla, escribe qué hay que corregir." };
  const sb = await createClient();
  const { data, error } = await sb.from("return_reviews").update({ decision, notes }).eq("id", reviewId).is("decision", null).select("id");
  if (error || !data?.length) return { error: "No pude guardar la decisión. Puede que ya esté decidida." };
  revalidatePath("/panel/revisiones");
  redirect("/panel/revisiones");
}

/** Registra que un graduado envió sin aprobación. A la segunda, la base suspende su revisión. */
export async function addStrike(form: FormData) {
  const v = await requireViewer();
  if (v.role !== "directora") return;
  const sb = await createClient();
  await sb.from("violations").insert({
    firm_id: String(form.get("firm_id")), tax_year: Number(form.get("tax_year")),
    case_id: String(form.get("case_id") ?? "") || null, kind: "envio_sin_aprobacion",
    noted_by: v.id, note: String(form.get("note") ?? "").trim().slice(0, 1000) || null,
  });
  revalidatePath("/panel/revisiones");
}
