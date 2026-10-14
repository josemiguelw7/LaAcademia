"use client";
import { useActionState } from "react";
import { loadDemo, removeDemo } from "./actions";

export function DemoButtons({ exists }: { exists: boolean }) {
  const [s1, load, p1] = useActionState(loadDemo, null);
  const [s2, clear, p2] = useActionState(removeDemo, null);
  const msg = s2 ?? s1;
  return (
    <div className="mt-5 space-y-3">
      <form action={load}>
        <button disabled={p1 || p2} className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">
          {p1 ? "Cargando… (unos segundos)" : exists ? "Reiniciar la demostración" : "Cargar la demostración"}
        </button>
      </form>
      {exists && (
        <form action={clear}>
          <button disabled={p1 || p2} className="h-11 w-full rounded-boton border-[1.5px] border-error bg-blanco text-[15px] font-semibold text-error disabled:opacity-60">
            {p2 ? "Borrando…" : "Borrar la demostración"}
          </button>
        </form>
      )}
      {msg?.error && <p className="text-[15px] text-error">{msg.error}</p>}
      {msg?.done && <p className="text-[15px] font-semibold text-correcto">{msg.done}</p>}
    </div>
  );
}
