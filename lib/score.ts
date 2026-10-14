import { isComplete, type Answers } from "@/lib/questionnaire";

/**
 * Puntaje v1 (0–100): cuánta atención necesita un caso, a partir del cuestionario y los documentos.
 * No juzga si la declaración está bien: mide complejidad y qué tan completo está el expediente.
 * 90–100 → revisión rápida · 70–89 → revisar lo marcado · menos de 70 → revisión completa.
 * Algunas de puntaje alto se mandan al azar a revisión a fondo, para que el puntaje se gane la confianza.
 */
export const SCORE_VERSION = "v1-2026-10";
export const RANDOM_AUDIT_RATE = 0.15;

export type ScoreInput = { answers: Answers; docs: { kind: string; label: string | null; status: string }[] };
export type ScoreResult = { score: number; reasons: string[]; band: "rapida" | "marcada" | "completa" };

export function scoreCase({ answers: a, docs }: ScoreInput): ScoreResult {
  let s = 100;
  const reasons: string[] = [];
  const hit = (points: number, why: string) => { s -= points; reasons.push(why); };

  if (!isComplete(a)) hit(20, "El cuestionario está incompleto");
  if (a.propio === true) hit(25, "Negocio propio (Anexo C): revisar ingresos y gastos");
  if (a.acciones === true) hit(15, "Venta de acciones o cripto (1099-B)");
  if (a.mercado === true) hit(10, "Seguro del Mercado (1095-A): conciliar el crédito");
  if (Number(a.dependientes) > 0) hit(10, `Dependientes (${a.dependientes}): revisar quién califica`);
  if (a.estado_civil === "separado") hit(10, "Separada o en divorcio: revisar el estado civil");
  if (a.retiro === true) hit(5, "Pensión o retiro (1099-R)");
  if (a.estudios === true) hit(5, "Estudios (1098-T)");
  if (a.hipoteca === true) hit(5, "Hipoteca (1098)");
  if (Number(a.w2) >= 3) hit(5, `${a.w2} trabajos con W-2`);

  const missing = docs.filter((d) => d.status === "esperado");
  for (const d of missing) hit(10, `Falta: ${d.label ?? d.kind}`);
  const w2Received = docs.filter((d) => d.kind === "w2" && d.status === "recibido").length;
  if (Number(a.w2) > 0 && w2Received < Number(a.w2) && !missing.some((d) => d.kind === "w2")) {
    hit(10, `Dijo ${a.w2} W-2 y hay ${w2Received}`);
  }

  const score = Math.max(0, Math.min(100, s));
  return { score, reasons, band: score >= 90 ? "rapida" : score >= 70 ? "marcada" : "completa" };
}

export const BAND_LABEL = { rapida: "Revisión rápida", marcada: "Revisar lo marcado", completa: "Revisión completa" } as const;
