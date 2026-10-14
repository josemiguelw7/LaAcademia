"use client";
import { useActionState } from "react";
import { createFirm, createClientAndCase } from "./actions";
import { AGREEMENT_POINTS } from "@/lib/agreement";

const field = "mt-1 h-12 w-full rounded-boton border border-linea bg-blanco px-3 text-[16px] outline-none focus:border-tinta";
const label = "block text-[14px] font-semibold text-tinta-2";

export function FirmForm() {
  const [state, action, pending] = useActionState(createFirm, null);
  return (
    <form action={action} className="mt-6 space-y-5">
      <label className={label}>Nombre de tu negocio<input name="business_name" required className={field} placeholder="Impuestos Ortega" /></label>
      <label className={label}>Últimos 4 números de tu PTIN (opcional)<input name="ptin_last4" inputMode="numeric" maxLength={4} className={field} placeholder="1234" /></label>
      <section className="rounded-tarjeta border border-linea bg-blanco p-4">
        <p className="text-[14px] font-bold">Acuerdo del programa</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] text-tinta-2">
          {AGREEMENT_POINTS.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <p className="mt-3 text-[13px] text-gris-texto">Versión provisional. Cuando esté la versión final te pediré confirmarla.</p>
        <label className="mt-4 flex items-start gap-3 text-[15px] font-semibold">
          <input type="checkbox" name="agreement" value="acepto" required className="mt-1 h-5 w-5 accent-[var(--color-tinta)]" />
          Lo leí y lo acepto
        </label>
      </section>
      {state?.error && <p className="text-[15px] text-error">{state.error}</p>}
      <button disabled={pending} className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">
        {pending ? "Guardando…" : "Abrir mi negocio"}
      </button>
    </form>
  );
}

export function ClientForm() {
  const [state, action, pending] = useActionState(createClientAndCase, null);
  return (
    <form action={action} className="mt-6 space-y-5">
      <label className={label}>Nombre completo<input name="full_name" required autoComplete="off" className={field} placeholder="María Ortega" /></label>
      <label className={label}>Correo (para mandarle su enlace)<input name="email" type="email" autoComplete="off" className={field} placeholder="maria@correo.com" /></label>
      <label className={label}>Teléfono (opcional)<input name="phone" type="tel" autoComplete="off" className={field} placeholder="512 555 0100" /></label>
      <label className={label}>
        Seguro Social o ITIN (opcional)
        <input name="ssn" inputMode="numeric" autoComplete="off" className={field} placeholder="9 números" />
        <span className="mt-1 block text-[13px] font-normal text-gris-texto">Se guarda cifrado. En pantalla solo verás los últimos 4.</span>
      </label>
      {state?.error && <p className="text-[15px] text-error">{state.error}</p>}
      <button disabled={pending} className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">
        {pending ? "Guardando…" : "Guardar y abrir su caso"}
      </button>
    </form>
  );
}
