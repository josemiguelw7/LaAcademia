import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { BAND_LABEL } from "@/lib/score";

export const metadata = { title: "Revisiones · Panel" };

const dias = (d: string) => { const n = Math.floor((Date.now() - new Date(d).getTime()) / 864e5); return n === 0 ? "hoy" : n === 1 ? "ayer" : `hace ${n} días`; };
const bandOf = (s: number | null) => (s === null ? null : s >= 90 ? "rapida" : s >= 70 ? "marcada" : "completa");

export default async function Revisiones() {
  const v = await requireViewer();
  if (v.role !== "directora") {
    return <main className="mt-6"><h1 className="text-[26px]">Revisiones</h1><p className="mt-2 text-[15px] text-tinta-2">Las declaraciones de los graduados solo las ve Liliana.</p></main>;
  }
  const sb = await createClient();
  const [{ data: queue }, { data: firms }, { data: quota }, { data: decided }] = await Promise.all([
    sb.from("return_reviews").select("id, version, submitted_at, cases(id, score, random_audit, tax_year, clients(full_name), firms(business_name))").is("decision", null).order("submitted_at", { ascending: true }),
    sb.from("firms").select("id, business_name"),
    sb.from("firm_review_quota").select("firm_id, tax_year, allowed, used, strikes"),
    sb.from("return_reviews").select("submitted_at, decided_at, decision, cases(score, random_audit)").not("decision", "is", null),
  ]);
  type D = { submitted_at: string; decided_at: string; decision: string; cases: { score: number | null; random_audit: boolean } };
  const done = (decided ?? []) as unknown as D[];
  const returned = done.filter((d) => d.decision === "devuelta").length;
  const hours = done.length ? Math.round(done.reduce((a, d) => a + (new Date(d.decided_at).getTime() - new Date(d.submitted_at).getTime()), 0) / done.length / 36e5) : null;
  const byBand = (["rapida", "marcada", "completa"] as const).map((b) => {
    const rows = done.filter((d) => bandOf(d.cases.score) === b && !d.cases.random_audit);
    return { b, n: rows.length, ret: rows.filter((d) => d.decision === "devuelta").length };
  });
  const audits = done.filter((d) => d.cases.random_audit);
  const pct = (a: number, n: number) => (n ? `${Math.round((a / n) * 100)}%` : "—");
  type Row = { id: string; version: number; submitted_at: string; cases: { id: string; score: number | null; random_audit: boolean; tax_year: number; clients: { full_name: string }; firms: { business_name: string } } };
  const rows = (queue ?? []) as unknown as Row[];
  const byFirm = new Map((firms ?? []).map((f) => [f.id, f.business_name]));
  return (
    <main className="mt-6">
      <h1 className="text-[26px] leading-tight">Revisiones</h1>
      <p className="mt-1 text-[15px] text-tinta-2">{rows.length ? `${rows.length} esperando, la más antigua primero.` : "No hay declaraciones esperando."}</p>
      <ul className="mt-4 divide-y divide-linea overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        {rows.map((r) => {
          const band = bandOf(r.cases.score);
          return (
            <li key={r.id}>
              <Link href={`/panel/revisiones/${r.id}`} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold">{r.cases.clients.full_name}{r.version > 1 && <span className="text-gris-texto"> · versión {r.version}</span>}</p>
                  <p className="text-[14px] text-tinta-2">{r.cases.firms.business_name} · {dias(r.submitted_at)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-titulo text-[24px] leading-none cifras">{r.cases.score ?? "—"}</p>
                  <p className={`mt-1 text-[12px] font-semibold ${band === "rapida" && !r.cases.random_audit ? "text-correcto" : "text-bronce-oscuro"}`}>
                    {r.cases.random_audit ? "Al azar: a fondo" : band ? BAND_LABEL[band] : ""}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-10 text-[20px]">Cómo va la temporada</h2>
      {done.length === 0 ? <p className="mt-2 text-[15px] text-gris-texto">Todavía no has decidido ninguna. Aquí vas a ver si el puntaje acierta.</p> : (
        <>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[26px] cifras">{done.length}</p><p className="text-[13px] text-gris-texto">revisadas</p></div>
            <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[26px] cifras">{pct(returned, done.length)}</p><p className="text-[13px] text-gris-texto">devueltas</p></div>
            <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[26px] cifras">{hours ?? "—"}<span className="text-[15px]"> h</span></p><p className="text-[13px] text-gris-texto">promedio en responder</p></div>
          </div>
          <table className="mt-4 w-full overflow-hidden rounded-tarjeta border border-linea bg-blanco text-[15px]">
            <thead><tr className="text-left text-[13px] text-gris-texto"><th className="p-3 font-semibold">Puntaje</th><th className="p-3 font-semibold">Revisadas</th><th className="p-3 font-semibold">Devueltas</th></tr></thead>
            <tbody>
              {byBand.map((r) => <tr key={r.b} className="border-t border-linea"><td className="p-3">{BAND_LABEL[r.b]}</td><td className="p-3 cifras">{r.n}</td><td className="p-3 cifras">{pct(r.ret, r.n)}</td></tr>)}
              <tr className="border-t border-linea"><td className="p-3">Al azar (puntaje alto)</td><td className="p-3 cifras">{audits.length}</td><td className="p-3 cifras">{pct(audits.filter((d) => d.decision === "devuelta").length, audits.length)}</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-[13px] text-gris-texto">Si las de revisión rápida o las elegidas al azar se devuelven seguido, el puntaje está siendo demasiado generoso y hay que ajustarlo.</p>
        </>
      )}

      <h2 className="mt-10 text-[20px]">Graduados</h2>
      <ul className="mt-3 divide-y divide-linea overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        {(quota ?? []).filter((q) => byFirm.has(q.firm_id)).map((q) => (
          <li key={`${q.firm_id}-${q.tax_year}`} className="flex items-center justify-between gap-4 p-4 text-[15px]">
            <span className="font-semibold">{byFirm.get(q.firm_id)} <span className="font-normal text-gris-texto">· {q.tax_year}</span></span>
            <span className="cifras text-tinta-2">{q.used} de {q.allowed} revisiones{q.strikes > 0 && <span className="ml-2 font-semibold text-error">{q.strikes} {q.strikes === 1 ? "falta" : "faltas"}</span>}</span>
          </li>
        ))}
        {!(quota ?? []).length && <li className="p-4 text-[15px] text-gris-texto">Todavía no hay graduados con negocio abierto.</li>}
      </ul>
    </main>
  );
}
