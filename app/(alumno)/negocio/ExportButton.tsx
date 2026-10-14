"use client";
import { useState } from "react";

export function ExportButton({ year }: { year: number }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async () => {
    setBusy(true); setError(null);
    try {
      const res = await fetch(`/negocio/exportar?year=${year}`, { method: "POST" });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "No pude armar el archivo.");
      window.location.href = json.url;
    } catch (e) { setError(e instanceof Error ? e.message : "No pude armar el archivo."); }
    finally { setBusy(false); }
  };
  return (
    <>
      <button onClick={go} disabled={busy} className="mt-3 h-11 w-full rounded-boton border-[1.5px] border-tinta bg-blanco text-[15px] font-semibold disabled:opacity-60">
        {busy ? "Armando tu archivo…" : `Descargar todo de la temporada ${year}`}
      </button>
      {error && <p className="mt-2 text-[14px] text-error">{error}</p>}
    </>
  );
}
