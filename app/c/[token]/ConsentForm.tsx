"use client";
import { useActionState } from "react";
import { signConsent } from "./actions";

export function ConsentForm({ token, paragraphs }: { token: string; paragraphs: string[] }) {
  const [state, action, pending] = useActionState(signConsent.bind(null, token), null);
  return (
    <form action={action} className="mt-4 rounded-tarjeta border border-linea bg-blanco p-4">
      {paragraphs.map((p) => <p key={p} className="mb-3 text-[15px] text-tinta-2">{p}</p>)}
      <label className="block text-[14px] font-semibold text-tinta-2">Tu nombre completo, como firma
        <input name="signer_name" required autoComplete="name" className="mt-1 h-12 w-full rounded-boton border border-linea bg-blanco px-3 text-[16px] outline-none focus:border-tinta" />
      </label>
      <label className="mt-4 flex items-start gap-3 text-[15px] font-semibold">
        <input type="checkbox" name="acepto" value="si" required className="mt-1 h-5 w-5 accent-[var(--color-tinta)]" />
        Doy mi permiso
      </label>
      {state?.error && <p className="mt-3 text-[15px] text-error">{state.error}</p>}
      <button disabled={pending} className="mt-4 h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">
        {pending ? "Guardando…" : "Firmar y continuar"}
      </button>
    </form>
  );
}
