"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function DeclarationUpload({ caseId, again }: { caseId: string; again: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const send = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setMsg(null);
    try {
      if (file.size > 4 * 1024 * 1024 - 1024) throw new Error("El PDF pesa más de 4 MB.");
      const form = new FormData();
      form.set("file", file, "declaracion.pdf");
      const res = await fetch(`/negocio/casos/${caseId}/declaracion`, { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "No pude mandarla a revisión.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No pude mandarla a revisión.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="mt-3">
      <input ref={input} type="file" accept="application/pdf" className="hidden" onChange={(e) => send(e.target.files?.[0])} />
      <button onClick={() => input.current?.click()} disabled={busy} className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco disabled:bg-deshabilitado-bg">
        {busy ? "Mandando…" : again ? "Mandar la versión corregida" : "Subir el PDF y mandarla a revisión"}
      </button>
      <p className="mt-2 text-[13px] text-gris-texto">El PDF que creas en TaxAct, sin enviarla todavía.</p>
      {msg && <p className="mt-2 text-[15px] text-error">{msg}</p>}
    </div>
  );
}
