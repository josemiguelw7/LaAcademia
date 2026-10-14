import Link from "next/link";
import { redirect } from "next/navigation";
import { requireGraduate } from "@/lib/platform";
import { ClientForm } from "../../Forms";

export const metadata = { title: "Nuevo cliente · La Academia" };

export default async function NuevoCliente() {
  const { firm } = await requireGraduate();
  if (!firm) redirect("/negocio");
  return (
    <main className="px-5 pt-8 sm:px-8">
      <Link href="/negocio" className="text-[14px] font-semibold text-bronce-oscuro">← Mi negocio</Link>
      <h1 className="mt-4 text-[26px] leading-tight sm:text-[32px]">Nuevo cliente</h1>
      <p className="mt-3 text-[16px] text-tinta-2">Con su nombre basta para empezar. Lo demás lo completa tu cliente con su enlace.</p>
      <ClientForm />
    </main>
  );
}
