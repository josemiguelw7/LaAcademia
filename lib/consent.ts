/** Consentimiento del cliente para compartir su información con la revisión.
 *  TEXTO PROVISIONAL: el abogado lo reemplaza por la versión con el lenguaje que exige la sección 7216. */
export const CONSENT_VERSION = "provisional-2026-10";

export const consentText = (business: string, until: string) => [
  `Autorizo a ${business}, quien prepara mi declaración de impuestos, a compartir la información de mi declaración y los documentos que suba aquí con Liliana Miranda, que revisa su trabajo antes de enviarlo, y con La Academia, que guarda los documentos de forma segura.`,
  "Esta información se usa solo para preparar y revisar mi declaración de este año. No se vende ni se usa para publicidad.",
  `Este permiso vale hasta el ${until}. Puedo retirarlo antes avisándole a ${business}.`,
  "No estoy obligado a dar este permiso. Si no lo doy, mi preparadora puede seguir preparando mi declaración sin usar esta herramienta.",
];
