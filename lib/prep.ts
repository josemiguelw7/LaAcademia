import "server-only";

export type PrepStepId = "ptin" | "eservices" | "efin_solicitud" | "huellas" | "efin_aprobado" | "taxact" | "plan_seguridad";

export type PrepStep = {
  id: PrepStepId;
  title: string;
  body: string;
  link?: { href: string; label: string };
  lesson?: { code: string; label: string };
  efin?: boolean; // forma parte del trámite del EFIN
};

/** Textos aprobables por Liliana: primera persona, «tú», sin cifras ni miedo al IRS. */
export const PREP_STEPS: PrepStep[] = [
  {
    id: "ptin",
    title: "Saca tu PTIN",
    body: "Es tu número de preparadora. Se pide en línea y sale el mismo día. Se renueva cada año.",
    link: { href: "https://www.irs.gov/tax-professionals/ptin-requirements-for-tax-return-preparers", label: "PTIN en IRS.gov" },
    lesson: { code: "02-01", label: "Lección 2.1" },
  },
  {
    id: "eservices",
    title: "Crea tu cuenta de e-Services del IRS",
    body: "Es la puerta para pedir el EFIN. Te pide verificar tu identidad, y eso puede tardar unos días.",
    link: { href: "https://www.irs.gov/e-services", label: "e-Services en IRS.gov" },
    efin: true,
  },
  {
    id: "efin_solicitud",
    title: "Envía tu solicitud de EFIN",
    body: "Como tipo de proveedor, elige «Electronic Return Originator (ERO)». No elijas «Online Provider»: ese EFIN no sirve para preparar declaraciones de clientes.",
    link: { href: "https://www.irs.gov/e-file-providers/become-an-authorized-e-file-provider", label: "Cómo pedir el EFIN" },
    efin: true,
  },
  {
    id: "huellas",
    title: "Agenda tus huellas",
    body: "El enlace para la cita aparece en el resumen de tu solicitud. Si eres abogada, CPA o agente inscrita, no las necesitas.",
    efin: true,
  },
  {
    id: "efin_aprobado",
    title: "Recibe tu EFIN",
    body: "El IRS revisa tu solicitud y te manda una carta con tu número. Puede tardar hasta 45 días.",
    efin: true,
  },
  {
    id: "taxact",
    title: "Consigue tu TaxAct Professional",
    body: "Para empezar con pocos clientes, el plan de pago por declaración es el más económico. Te lo explico en la lección 8.1.",
    lesson: { code: "08-01", label: "Lección 8.1" },
  },
  {
    id: "plan_seguridad",
    title: "Escribe tu plan de seguridad",
    body: "La ley pide a cada preparadora un plan escrito para proteger los datos de sus clientes. Te dejo la plantilla aquí en noviembre.",
  },
];

/** Días que faltan hasta la fecha (en la zona horaria de Texas), o negativo si ya pasó. */
export function daysUntil(isoDate: string, now = new Date()): number {
  const today = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const fechaLarga = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]}`;
};
