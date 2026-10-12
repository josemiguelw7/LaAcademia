"use client";
import { useActionState } from "react";
import { sendCode, verifyCode } from "./actions";

const input = "h-[52px] w-full rounded-boton border border-linea bg-blanco px-4 text-[17px] outline-none focus:border-tinta";
const primary = "h-[52px] w-full rounded-boton bg-tinta px-5 text-[15px] font-bold text-blanco active:bg-tinta-2 disabled:bg-deshabilitado-bg disabled:text-deshabilitado-fg";

export function EmailForm({ sigue }: { sigue: string }) {
  const [state, action, pending] = useActionState(sendCode, null);
  return (
    <form action={action} className="mt-8 space-y-3">
      <input type="hidden" name="sigue" value={sigue} />
      <label className="block text-[13px] font-semibold text-tinta-2" htmlFor="email">Tu correo</label>
      <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required className={input} placeholder="tucorreo@ejemplo.com" />
      {state?.error && <p className="rounded-boton bg-error-suave px-3 py-2 text-[14px] text-error">{state.error}</p>}
      <button disabled={pending} className={primary}>{pending ? "Enviando…" : "Envíame mi código"}</button>
    </form>
  );
}

export function CodeForm({ email, sigue }: { email: string; sigue: string }) {
  const [state, action, pending] = useActionState(verifyCode, null);
  return (
    <form action={action} className="mt-8 space-y-3">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="sigue" value={sigue} />
      <label className="block text-[13px] font-semibold text-tinta-2" htmlFor="token">Código de 6 números</label>
      <input id="token" name="token" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required autoFocus
        className={`${input} cifras text-center text-[24px] tracking-[0.4em]`} placeholder="••••••" />
      {state?.error && <p className="rounded-boton bg-error-suave px-3 py-2 text-[14px] text-error">{state.error}</p>}
      <button disabled={pending} className={primary}>{pending ? "Revisando…" : "Entrar"}</button>
    </form>
  );
}
