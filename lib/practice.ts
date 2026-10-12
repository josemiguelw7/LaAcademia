import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

type Cifra = { concept: string; variant: string | null; value: number };

/** Evaluates an answer-key expression like "1960*cifra('tarifa_millas','ene-jun') + 300" against the year's figures. */
export function evalExpr(expr: string, cifras: Cifra[]): number {
  const replaced = expr.replace(/cifra\('([^']+)'(?:,\s*'([^']+)')?\)/g, (_m, concept: string, variant?: string) => {
    const row = cifras.find((c) => c.concept === concept && (variant ? c.variant === variant : true));
    if (!row) throw new Error(`cifra faltante: ${concept} ${variant ?? ""}`);
    return String(row.value);
  });
  if (!/^[\d.\s+\-*/()]+$/.test(replaced)) throw new Error(`expresión inválida: ${expr}`);
  return Number(Function(`"use strict"; return (${replaced});`)());
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export async function getCaseForPractice(code: string) {
  const db = createAdminClient();
  const { data: p } = await db.from("practices").select("id, code, title, tax_year, kind, form_type, modules(position, title), practice_cases(id, position, title, narrative, documents, practice_boxes(id, line_no, label, kind))").eq("code", code).single();
  return p;
}

export async function yearCifras(year: number): Promise<Cifra[]> {
  const db = createAdminClient();
  const { data } = await db.from("cifras").select("concept, variant, value").eq("tax_year", year);
  return (data ?? []).map((c) => ({ ...c, value: Number(c.value) }));
}
