import { requireViewer } from "@/lib/auth";
import { getDemoState, demoEmail } from "@/lib/demo-seed";
import { DemoButtons } from "./DemoButtons";

export const metadata = { title: "Demostración · Panel" };
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ROLES = [
  { tag: "alumna", label: "Alumna (nivel medio)", sees: "Curso a medio camino (8 lecciones dominadas), «Tu preparación» con 2 pasos, avisos." },
  { tag: "graduada", label: "Graduada (nivel alto)", sees: "Curso terminado, «Mi negocio» con 4 clientes en distintos momentos, plantillas, cupo y avisos." },
  { tag: "liliana", label: "Liliana (directora)", sees: "Panel → Revisiones: Rosa esperando, María aprobada, Ana devuelta; métricas de la temporada." },
];

export default async function Demo() {
  const v = await requireViewer();
  if (v.role !== "admin") return <main className="mt-6"><p className="text-[15px] text-tinta-2">Solo el administrador ve esta pestaña.</p></main>;
  const state = await getDemoState();
  return (
    <main className="mt-6">
      <h1 className="text-[26px] leading-tight">Demostración</h1>
      <p className="mt-2 text-[15px] text-tinta-2">
        Tres cuentas para ver la plataforma como la ve cada quien. Se entra en <strong>/entrar</strong> con el correo de la cuenta; el código llega a tu bandeja
        porque son variantes de tu correo con «+».
      </p>
      <ul className="mt-5 space-y-3">
        {ROLES.map((r) => (
          <li key={r.tag} className="rounded-tarjeta border border-linea bg-blanco p-4">
            <p className="text-[16px] font-semibold">{r.label}</p>
            <p className="mt-1 font-mono text-[14px] text-bronce-oscuro">{demoEmail(v.email, r.tag)}</p>
            <p className="mt-1 text-[14px] text-tinta-2">{r.sees}</p>
          </li>
        ))}
      </ul>
      <section className="mt-5 rounded-tarjeta border border-bronce bg-bronce-suave p-4 text-[14px] text-tinta-2">
        <p className="font-semibold text-tinta">Los clientes de la graduada</p>
        <p className="mt-1">María: aprobada y enviada · Ana: devuelta con notas · Rosa: negocio propio, en revisión · Carlos: contestó, sin permiso ni documentos.</p>
        <p className="mt-1">Los documentos son PDF que dicen «ejemplo de demostración». Los Seguro Social son de prueba (900-…).</p>
      </section>
      <p className="mt-4 text-[14px] text-gris-texto">{state ? `Cargada el ${new Date(state.createdAt).toLocaleString("es-US", { timeZone: "America/Chicago" })}.` : "Todavía no está cargada."}</p>
      <DemoButtons exists={!!state} />
      <p className="mt-6 text-[13px] text-gris-texto">Antes de abrir a los alumnos, bórrala: la cuenta «Liliana Demo» es directora y vería las revisiones reales.</p>
    </main>
  );
}
