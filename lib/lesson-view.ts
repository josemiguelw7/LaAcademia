import "server-only";
import { marked } from "marked";
import { getPlayerLesson, getCifras } from "@/lib/course";

const fmt = (value: number, unit: string) =>
  unit === "usd" ? `$${Number(value).toLocaleString("en-US")}` : unit === "pct" ? `${value}%` : unit === "usd_per_mile" ? `${Math.round(value * 1000) / 10}¢ por milla` : unit === "usd_per_sqft" ? `$${value} por pie²` : String(value);

/** Lección lista para el reproductor: segmentos en HTML con las tarjetas de cifras del año. */
export async function buildPlayerLesson(code: string, isStaff: boolean) {
  const lesson = await getPlayerLesson(code);
  if (!lesson) return null;
  const cifras = (await getCifras(lesson.cifras)).filter((c) => c.verified_at || isStaff);
  const card = (concept: string) => {
    const rows = cifras.filter((c) => c.concept === concept);
    if (!rows.length) return `<span class="cifra">Cifra del año: se muestra cuando Liliana la verifique</span>`;
    const items = rows.map((r) => `<li><span>${r.label_es}</span><strong class="cifras">${fmt(r.value, r.unit)}</strong>${r.verified_at ? "" : " <em>(sin verificar)</em>"}</li>`).join("");
    return `<div class="cifra-card"><p>Año fiscal ${rows[0].tax_year} · fuente: IRS</p><ul>${items}</ul></div>`;
  };
  const segments = lesson.segments.map((s) => ({
    ...s,
    html: marked.parse(s.transcript.replace(/<Cifra concept="([^"]+)"[^>]*\/>/g, (_m, c) => card(c)), { async: false }) as string,
  }));
  return { ...lesson, segments };
}
