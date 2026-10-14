import type { DocKind } from "@/lib/documents";

/**
 * Cuestionario del cliente, versión 1. Lo contesta el cliente por su enlace o el graduado con él.
 * De las respuestas sale la lista de documentos que hay que pedir. Textos para aprobación de Liliana.
 * No decide el estado civil para efectos fiscales: eso lo determina la preparadora.
 */
export type Question =
  | { id: string; type: "choice"; label: string; options: { value: string; label: string }[] }
  | { id: string; type: "count"; label: string; hint?: string; max: number }
  | { id: string; type: "yesno"; label: string; hint?: string };

export const QUESTIONNAIRE_VERSION = "v1-2026-10";

export const QUESTIONS: Question[] = [
  { id: "estado_civil", type: "choice", label: "¿Cuál es tu situación el 31 de diciembre?", options: [
    { value: "soltero", label: "Soltera o soltero" },
    { value: "casado", label: "Casada o casado" },
    { value: "separado", label: "Separada, separado o en proceso de divorcio" },
    { value: "viudo", label: "Viuda o viudo" },
  ] },
  { id: "dependientes", type: "count", label: "¿Cuántas personas viven contigo y dependen de ti?", hint: "Hijos, nietos, padres u otros familiares. Si nadie, pon 0.", max: 15 },
  { id: "w2", type: "count", label: "¿En cuántos trabajos te pagaron con cheque de nómina?", hint: "Cada trabajo te manda un W-2.", max: 10 },
  { id: "propio", type: "yesno", label: "¿Trabajaste por tu cuenta o con apps?", hint: "Por ejemplo Uber, DoorDash, Instacart, limpieza, construcción o ventas." },
  { id: "intereses", type: "yesno", label: "¿Tu banco te pagó intereses?" },
  { id: "desempleo", type: "yesno", label: "¿Recibiste beneficios de desempleo?" },
  { id: "seguro_social", type: "yesno", label: "¿Recibiste Seguro Social?" },
  { id: "retiro", type: "yesno", label: "¿Recibiste pensión o sacaste dinero de un plan de retiro?" },
  { id: "mercado", type: "yesno", label: "¿Tuviste seguro médico del Mercado (healthcare.gov)?" },
  { id: "estudios", type: "yesno", label: "¿Pagaste estudios después de la preparatoria?" },
  { id: "hipoteca", type: "yesno", label: "¿Pagas hipoteca de tu casa?" },
  { id: "acciones", type: "yesno", label: "¿Vendiste acciones o criptomonedas?" },
];

export type Answers = Record<string, string | number | boolean>;

/** La lista de documentos que se le piden al cliente según sus respuestas. */
export function expectedDocs(a: Answers): { kind: DocKind; label: string }[] {
  const out: { kind: DocKind; label: string }[] = [{ kind: "identificacion", label: "Identificación con foto" }];
  const n = Math.max(0, Math.min(10, Number(a.w2) || 0));
  for (let i = 1; i <= n; i++) out.push({ kind: "w2", label: n > 1 ? `W-2 del trabajo ${i}` : "W-2" });
  if (a.propio === true) {
    out.push({ kind: "1099-nec", label: "1099-NEC (si te llegó)" });
    out.push({ kind: "1099-k", label: "1099-K (si te llegó)" });
    out.push({ kind: "otro", label: "Tus cuentas del negocio: ingresos y gastos del año" });
  }
  if (a.intereses === true) out.push({ kind: "1099-int", label: "1099-INT de tu banco" });
  if (a.desempleo === true) out.push({ kind: "1099-g", label: "1099-G de desempleo" });
  if (a.seguro_social === true) out.push({ kind: "ssa-1099", label: "SSA-1099 del Seguro Social" });
  if (a.retiro === true) out.push({ kind: "1099-r", label: "1099-R de tu pensión o plan de retiro" });
  if (a.mercado === true) out.push({ kind: "1095-a", label: "1095-A del Mercado" });
  if (a.estudios === true) out.push({ kind: "1098-t", label: "1098-T de la escuela" });
  if (a.hipoteca === true) out.push({ kind: "1098", label: "1098 de tu hipoteca" });
  if (a.acciones === true) out.push({ kind: "1099-b", label: "1099-B de tu cuenta de inversión" });
  return out;
}

/** Convierte el formulario en respuestas limpias, solo con las preguntas conocidas. */
export function parseAnswers(form: FormData): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) {
    const raw = form.get(q.id);
    if (raw === null || raw === "") continue;
    if (q.type === "count") a[q.id] = Math.max(0, Math.min(q.max, Math.trunc(Number(raw)) || 0));
    else if (q.type === "yesno") a[q.id] = raw === "si";
    else if (q.options.some((o) => o.value === raw)) a[q.id] = String(raw);
  }
  return a;
}

export const isComplete = (a: Answers) => QUESTIONS.every((q) => q.id in a);
