import { notFound, redirect } from "next/navigation";
import { marked } from "marked";
import { requireViewer } from "@/lib/auth";
import { getCourseTree, getPlayerLesson, getCifras } from "@/lib/course";
import { Player } from "./Player";

const fmt = (value: number, unit: string) =>
  unit === "usd" ? `$${Number(value).toLocaleString("en-US")}` : unit === "pct" ? `${value}%` : unit === "usd_per_mile" ? `${Math.round(value * 1000) / 10}¢ por milla` : unit === "usd_per_sqft" ? `$${value} por pie²` : String(value);

export default async function Leccion({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await requireViewer();
  const lesson = await getPlayerLesson(code);
  if (!lesson) notFound();
  const tree = await getCourseTree(v.id, v.isStaff);
  const node = tree.flatMap((m) => m.lessons).find((l) => l.code === code);
  if (!node || node.status === "bloqueada") redirect("/curso");

  const cifras = (await getCifras(lesson.cifras)).filter((c) => c.verified_at || v.isStaff);
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
  return <Player lesson={{ ...lesson, segments }} mastered={node.status === "dominada"} />;
}
