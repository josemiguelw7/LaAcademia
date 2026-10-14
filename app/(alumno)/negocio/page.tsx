import Link from "next/link";
import { requireGraduate, currentTaxYear } from "@/lib/platform";
import { FirmForm } from "./Forms";

export const metadata = { title: "Mi negocio · La Academia" };

const STATUS: Record<string, string> = {
  recepcion: "Recibiendo documentos", listo_para_preparar: "Listo para preparar", en_revision: "En revisión con Liliana",
  devuelta: "Devuelta para corregir", aprobada: "Aprobada", enviada: "Enviada", cerrada: "Cerrada",
};

export default async function Negocio() {
  const { sb, firm } = await requireGraduate();
  if (!firm) {
    return (
      <main className="px-5 pt-8 sm:px-8">
        <h1 className="text-[26px] leading-tight sm:text-[32px]">Abre tu negocio</h1>
        <p className="mt-3 text-[16px] text-tinta-2">Aquí vas a llevar a tus clientes: lo que te mandan, lo que falta y cada declaración que me pasas a revisar.</p>
        <FirmForm />
      </main>
    );
  }
  const year = await currentTaxYear(sb);
  const [{ data: cases }, { data: quota }] = await Promise.all([
    sb.from("cases").select("id, status, created_at, clients(full_name, ssn_last4), case_documents(status)").eq("firm_id", firm.id).eq("tax_year", year ?? 0).order("created_at", { ascending: false }),
    sb.from("firm_review_quota").select("allowed, used, strikes").eq("firm_id", firm.id).eq("tax_year", year ?? 0).maybeSingle(),
  ]);
  return (
    <main className="px-5 pt-8 sm:px-8">
      <p className="text-[13px] font-bold text-gris-texto">Temporada {year ?? "—"}</p>
      <h1 className="mt-1 text-[26px] leading-tight sm:text-[32px]">{firm.business_name}</h1>
      {quota && (
        <p className="mt-2 text-[15px] text-tinta-2">
          Revisiones conmigo: <strong className="cifras text-tinta">{quota.used} de {quota.allowed}</strong> usadas
        </p>
      )}
      <Link href="/negocio/clientes/nuevo" className="mt-6 flex h-[52px] items-center justify-center rounded-boton bg-tinta text-[16px] font-bold text-blanco">Nuevo cliente</Link>
      <ul className="mt-6 space-y-3">
        {(cases ?? []).map((c) => {
          const client = c.clients as unknown as { full_name: string; ssn_last4: string | null };
          const docs = (c.case_documents ?? []) as { status: string }[];
          const missing = docs.filter((d) => d.status === "esperado").length;
          return (
            <li key={c.id}>
              <Link href={`/negocio/casos/${c.id}`} className="block rounded-tarjeta border border-linea bg-blanco p-4">
                <p className="text-[17px] font-semibold">{client.full_name}</p>
                <p className="mt-1 text-[14px] text-tinta-2">
                  {STATUS[c.status] ?? c.status}
                  {c.status === "recepcion" && docs.length > 0 && (missing ? ` · faltan ${missing}` : " · todo recibido")}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
      {!cases?.length && <p className="mt-6 text-[15px] text-tinta-2">Todavía no tienes clientes en esta temporada. Empieza con el primero.</p>}
    </main>
  );
}
