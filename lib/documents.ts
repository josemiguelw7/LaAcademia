/** Tipos de documento del caso y cómo se llaman para el cliente. */
export const DOC_KINDS = {
  "w2": "W-2",
  "1099-nec": "1099-NEC",
  "1099-misc": "1099-MISC",
  "1099-k": "1099-K",
  "1099-int": "1099-INT",
  "1099-div": "1099-DIV",
  "1099-r": "1099-R",
  "1099-b": "1099-B",
  "1099-g": "1099-G",
  "ssa-1099": "SSA-1099",
  "1098": "1098",
  "1098-t": "1098-T",
  "1095-a": "1095-A",
  "identificacion": "Identificación con foto",
  "otro": "Otro documento",
} as const;
export type DocKind = keyof typeof DOC_KINDS;
export const isDocKind = (k: string): k is DocKind => k in DOC_KINDS;

export type DocStatus = "esperado" | "recibido" | "no_aplica";
export const DOC_STATUS_LABEL: Record<DocStatus, string> = { esperado: "Falta", recibido: "Recibido", no_aplica: "No aplica" };
