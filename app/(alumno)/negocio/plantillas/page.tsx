import Link from "next/link";
import { requireGraduate } from "@/lib/platform";
import { TEMPLATES } from "@/lib/templates";

export const metadata = { title: "Plantillas · La Academia" };

export default async function Plantillas() {
  await requireGraduate();
  return (
    <main className="px-5 pt-8 sm:px-8">
      <Link href="/negocio" className="text-[14px] font-semibold text-bronce-oscuro">← Mi negocio</Link>
      <h1 className="mt-4 text-[26px] leading-tight sm:text-[32px]">Plantillas para tu negocio</h1>
      <p className="mt-3 text-[16px] text-tinta-2">Te las dejo listas para llenar e imprimir.</p>
      <ul className="mt-6 space-y-3">
        {TEMPLATES.map((t) => (
          <li key={t.slug}>
            <Link href={`/negocio/plantillas/${t.slug}`} className="block rounded-tarjeta border border-linea bg-blanco p-4">
              <p className="text-[17px] font-semibold">{t.title}</p>
              <p className="mt-1 text-[15px] text-tinta-2">{t.intro}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
