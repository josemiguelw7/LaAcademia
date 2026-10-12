import { createAdminClient } from "@/lib/supabase/admin";
import { saveCifra, unverifyCifra } from "../actions";

const unitLabel: Record<string, string> = { usd: "$", pct: "%", usd_per_mile: "$/milla", usd_per_sqft: "$/pie²", count: "#" };

export default async function Cifras() {
  const { data } = await createAdminClient().from("cifras").select("*").eq("tax_year", 2026).order("concept").order("filing_status", { nullsFirst: true }).order("variant", { nullsFirst: true });
  const rows = data ?? [];
  const pending = rows.filter((r) => !r.verified_at).length;
  return (
    <main className="mt-6">
      <h1 className="text-[26px] leading-tight">Cifras del año fiscal 2026</h1>
      <p className="mt-1 text-[15px] text-tinta-2">
        Las alumnas solo ven una cifra cuando tú la verificas. {pending ? <strong className="text-tinta">{pending} esperan tu verificación.</strong> : "Todas están verificadas."} Compara cada una con la fuente antes de verificarla.
      </p>
      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <li key={r.id} className={`rounded-tarjeta border bg-blanco p-4 ${r.verified_at ? "border-linea" : "border-bronce"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold">{r.label_es}</p>
                <p className="text-[12px] text-gris-texto">{r.concept}{r.filing_status ? ` · ${r.filing_status}` : ""}{r.variant ? ` · ${r.variant}` : ""}{r.notes ? ` · ${r.notes}` : ""}</p>
                <p className="mt-1 break-all text-[12px] text-bronce-oscuro">{r.source_url.startsWith("http") ? <a href={r.source_url} target="_blank" rel="noreferrer" className="underline underline-offset-2">Fuente</a> : r.source_url}</p>
              </div>
              {r.verified_at
                ? <span className="rounded-full bg-correcto-suave px-2.5 py-0.5 text-[12px] font-semibold text-correcto">Verificada {new Date(r.verified_at).toLocaleDateString("es-US")}</span>
                : <span className="rounded-full bg-bronce-suave px-2.5 py-0.5 text-[12px] font-semibold text-bronce-oscuro">Sin verificar</span>}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <form action={saveCifra} className="flex items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <span className="text-[13px] text-gris-texto">{unitLabel[r.unit]}</span>
                <input name="value" defaultValue={String(r.value)} inputMode="decimal" className="h-10 w-32 rounded-boton border border-linea px-3 text-right text-[15px] cifras outline-none focus:border-tinta" />
                <button className="h-10 rounded-boton bg-tinta px-4 text-[14px] font-bold text-blanco">{r.verified_at ? "Guardar" : "Verificar"}</button>
              </form>
              {r.verified_at && (
                <form action={unverifyCifra}><input type="hidden" name="id" value={r.id} /><button className="h-10 px-2 text-[13px] font-semibold text-gris-texto underline underline-offset-2">Quitar verificación</button></form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
