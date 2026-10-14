import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { requireGraduate } from "@/lib/platform";
import { findTemplate } from "@/lib/templates";

export default async function Plantilla({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { firm } = await requireGraduate();
  const t = findTemplate(slug);
  if (!t) notFound();
  const body = firm ? t.body.replaceAll("[nombre de tu negocio]", firm.business_name) : t.body;
  return (
    <main className="px-5 pt-8 sm:px-8">
      <div className="print:hidden">
        <Link href="/negocio/plantillas" className="text-[14px] font-semibold text-bronce-oscuro">← Plantillas</Link>
        <p className="mt-4 text-[15px] text-tinta-2">{t.intro}</p>
        <p className="mt-2 text-[14px] text-gris-texto">Para imprimirla o guardarla en PDF, usa «Imprimir» en tu navegador.</p>
      </div>
      <article className="guion mt-6 rounded-tarjeta border border-linea bg-blanco p-5 print:border-0 print:p-0" dangerouslySetInnerHTML={{ __html: marked.parse(body, { async: false }) as string }} />
    </main>
  );
}
