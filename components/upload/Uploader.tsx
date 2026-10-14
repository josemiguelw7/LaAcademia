"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Doc = { id: string; label: string; status: "esperado" | "recibido" | "no_aplica" };
const MAX_PDF = 4 * 1024 * 1024 - 1024;

/** Foto → JPEG de máximo 1600 px de lado, hecho en el teléfono antes de subir. */
async function compress(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return await new Promise((ok, fail) => canvas.toBlob((b) => (b ? ok(b) : fail(new Error("jpeg"))), "image/jpeg", 0.82));
}

export function Uploader({ endpoint, docs, viewHref }: { endpoint: string; docs: Doc[]; viewHref?: (id: string) => string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ id: string; text: string } | null>(null);

  const pick = (id: string) => { setTarget(id); setMsg(null); input.current?.click(); };

  const onFile = async (file: File | undefined) => {
    if (!file || !target) return;
    const id = target;
    setBusy(id);
    try {
      let body: Blob;
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        if (file.size > MAX_PDF) throw new Error("Ese PDF pesa más de 4 MB. Toma fotos de cada página y súbelas.");
        body = file;
      } else {
        try { body = await compress(file); }
        catch { throw new Error("No pude leer esa foto. Prueba tomarla otra vez con la cámara."); }
      }
      const form = new FormData();
      form.set("doc_id", id);
      form.set("file", body, "documento");
      const res = await fetch(endpoint, { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "No se pudo subir. Vuelve a intentarlo.");
      setMsg({ id, text: "Recibido." });
      router.refresh();
    } catch (e) {
      setMsg({ id, text: e instanceof Error ? e.message : "No se pudo subir." });
    } finally {
      setBusy(null);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <>
      <input ref={input} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <ul className="space-y-2">
        {docs.filter((d) => d.status !== "no_aplica").map((d) => (
          <li key={d.id} className={`rounded-tarjeta border p-3 ${d.status === "recibido" ? "border-correcto bg-correcto-suave" : "border-linea bg-blanco"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold">{d.label}</p>
                <p className={`text-[13px] font-semibold ${d.status === "recibido" ? "text-correcto" : "text-gris-texto"}`}>{d.status === "recibido" ? "✓ Recibido" : "Falta"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {d.status === "recibido" && viewHref && (
                  <a href={viewHref(d.id)} target="_blank" rel="noopener" className="text-[13px] font-semibold text-bronce-oscuro underline underline-offset-4">Ver</a>
                )}
                <button onClick={() => pick(d.id)} disabled={!!busy}
                  className={`h-10 rounded-boton px-3 text-[14px] font-bold ${d.status === "recibido" ? "border-[1.5px] border-linea bg-blanco text-tinta" : "bg-tinta text-blanco"} disabled:opacity-60`}>
                  {busy === d.id ? "Subiendo…" : d.status === "recibido" ? "Cambiar" : "Subir"}
                </button>
              </div>
            </div>
            {msg?.id === d.id && <p className={`mt-2 text-[14px] ${msg.text === "Recibido." ? "text-correcto" : "text-error"}`}>{msg.text}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
