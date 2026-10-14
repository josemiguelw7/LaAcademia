"use client";
import { useActionState } from "react";
import { decide } from "../actions";

export function DecisionForm({ reviewId }: { reviewId: string }) {
  const [state, action, pending] = useActionState(decide.bind(null, reviewId), null);
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="block text-[14px] font-semibold text-tinta-2">Notas para el graduado (obligatorias si la devuelves)
        <textarea name="notes" rows={5} className="mt-1 w-full rounded-boton border border-linea bg-blanco p-3 text-[16px] outline-none focus:border-tinta" placeholder="Qué hay que corregir y por qué." />
      </label>
      {state?.error && <p className="text-[15px] text-error">{state.error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <button name="decision" value="aprobada" disabled={pending} className="h-[52px] rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">Aprobar</button>
        <button name="decision" value="devuelta" disabled={pending} className="h-[52px] rounded-boton border-[1.5px] border-tinta bg-blanco text-[16px] font-bold">Devolver con notas</button>
      </div>
    </form>
  );
}
