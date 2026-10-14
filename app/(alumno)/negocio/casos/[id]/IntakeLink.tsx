"use client";
import { useState, useTransition } from "react";
import { createIntakeLink } from "../../actions";

/** El enlace se ve una sola vez: en la base solo queda su huella. Crear otro revoca el anterior. */
export function IntakeLink({ caseId, clientName }: { caseId: string; clientName: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const make = () => start(async () => {
    setCopied(false);
    const r = await createIntakeLink(caseId);
    setUrl(r.url); setError(r.error);
  });
  const share = async () => {
    if (!url) return;
    const text = `Hola, ${clientName.split(" ")[0]}. Aquí puedes contestar unas preguntas y subir tus documentos para tu declaración: ${url}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { /* cancelado */ } }
    await navigator.clipboard.writeText(text); setCopied(true);
  };
  return (
    <section className="mt-6 rounded-tarjeta border border-bronce bg-bronce-suave p-4">
      <p className="text-[15px] font-bold">Enlace para tu cliente</p>
      <p className="mt-1 text-[14px] text-tinta-2">Con él firma su permiso, contesta las preguntas y sube sus documentos desde su teléfono. Vence en 30 días.</p>
      {url ? (
        <>
          <p className="mt-3 break-all rounded-boton border border-linea bg-blanco p-3 font-mono text-[13px]">{url}</p>
          <button onClick={share} className="mt-3 h-11 w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco">{copied ? "Copiado" : "Mandárselo"}</button>
          <p className="mt-2 text-[13px] text-gris-texto">Guárdalo o mándalo ahora: por seguridad no lo puedo volver a mostrar. Si lo pierdes, crea otro.</p>
        </>
      ) : (
        <button onClick={make} disabled={pending} className="mt-3 h-11 w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco disabled:bg-deshabilitado-bg">
          {pending ? "Creando…" : "Crear enlace"}
        </button>
      )}
      {error && <p className="mt-2 text-[14px] text-error">{error}</p>}
    </section>
  );
}
