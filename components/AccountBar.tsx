import type { Viewer } from "@/lib/auth";
import { DEMO_DOMAIN } from "@/lib/demo-seed";

const ROLE: Record<Viewer["role"], string> = { alumno: "", directora: "Directora", admin: "Admin" };

/** Quién está adentro y cómo salir, siempre a la vista. Las cuentas de demostración dicen que lo son. */
export function AccountBar({ v, className = "" }: { v: Viewer; className?: string }) {
  const demo = v.email.endsWith(`@${DEMO_DOMAIN}`);
  const who = v.fullName || v.email;
  return (
    <div className={`flex items-center justify-end gap-3 text-[13px] ${className}`}>
      <span className="min-w-0 truncate text-gris-texto">
        {demo && <span className="mr-1.5 rounded-full border border-bronce bg-bronce-suave px-2 py-0.5 font-semibold text-bronce-oscuro">Demo</span>}
        {who}{ROLE[v.role] ? ` · ${ROLE[v.role]}` : ""}
      </span>
      <form action="/salir" method="post" className="shrink-0">
        <button className="font-semibold text-bronce-oscuro underline underline-offset-4">{demo ? "Cambiar de cuenta" : "Salir"}</button>
      </form>
    </div>
  );
}
