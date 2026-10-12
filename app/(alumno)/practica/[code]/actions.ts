"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { evalExpr, round2, yearCifras } from "@/lib/practice";

export type BoxResult = { id: string; ok: boolean; note: string | null };
export type GradeResult = { correct: number; total: number; boxes: BoxResult[]; netProfit: number };

export async function gradeCase(caseId: string, answers: Record<string, string>): Promise<GradeResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");
  const db = createAdminClient();
  const { data: c } = await db.from("practice_cases").select("id, practices(tax_year), practice_boxes(id, line_no, expected_expr, note_on_error)").eq("id", caseId).single();
  if (!c) throw new Error("no case");
  const year = (c.practices as unknown as { tax_year: number }).tax_year;
  const cifras = await yearCifras(year);
  const parse = (s: string | undefined) => Number(String(s ?? "").replace(/[$,\s]/g, ""));
  let gross = 0, cogs = 0, expenses = 0;
  const boxes: BoxResult[] = c.practice_boxes.map((b) => {
    const expected = round2(evalExpr(b.expected_expr, cifras));
    const got = parse(answers[b.id]);
    const ok = Number.isFinite(got) && answers[b.id] !== "" && Math.abs(got - expected) <= 1;
    if (b.line_no === "1") gross = expected; else if (b.line_no === "4") cogs = expected; else expenses += expected;
    if (ok) return { id: b.id, ok, note: null };
    const notes = b.note_on_error as Record<string, string>;
    let note = notes["_"] ?? "Casi. Revisa los documentos de esta línea.";
    for (const [k, msg] of Object.entries(notes)) {
      if (k === "_") continue;
      try { if (Math.abs(round2(evalExpr(k, cifras)) - got) <= 1) { note = msg; break; } } catch { /* ignore bad key */ }
    }
    return { id: b.id, ok, note };
  });
  const correct = boxes.filter((b) => b.ok).length;
  await db.from("practice_attempts").insert({ user_id: user.id, case_id: caseId, submitted: answers, correct_boxes: correct, total_boxes: boxes.length });
  return { correct, total: boxes.length, boxes, netProfit: round2(gross - cogs - expenses) };
}
