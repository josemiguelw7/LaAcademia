"use client";
import { useActionState } from "react";
import { grantAccess } from "./actions";

const field = "h-11 w-full rounded-boton border border-linea bg-blanco px-3 text-[15px] outline-none focus:border-tinta";
export function GrantForm() {
  const [state, action, pending] = useActionState(grantAccess, null);
  return (
    <form action={action} className="grid gap-3 rounded-tarjeta border border-linea bg-blanco p-5 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
      <label className="text-[13px] font-semibold text-tinta-2">Correo<input name="email" type="email" required className={`${field} mt-1`} placeholder="alumna@correo.com" /></label>
      <label className="text-[13px] font-semibold text-tinta-2">Nombre (opcional)<input name="name" className={`${field} mt-1`} placeholder="María Ortega" /></label>
      <label className="text-[13px] font-semibold text-tinta-2">Nivel
        <select name="plan" className={`${field} mt-1`} defaultValue="curso"><option value="curso">Curso</option><option value="soporte">Soporte de temporada</option><option value="mentoria">Mentoría</option></select>
      </label>
      <button disabled={pending} className="h-11 rounded-boton bg-tinta px-5 text-[15px] font-bold text-blanco disabled:bg-deshabilitado-bg">{pending ? "Dando acceso…" : "Dar acceso"}</button>
      {state?.error && <p className="text-[14px] text-error sm:col-span-4">{state.error}</p>}
      {state?.ok && <p className="text-[14px] text-correcto sm:col-span-4">{state.ok}</p>}
    </form>
  );
}
