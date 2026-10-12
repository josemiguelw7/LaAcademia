import { createAdminClient } from "@/lib/supabase/admin";
import { GrantForm } from "./GrantForm";

const PLAN = { curso: "Curso", soporte: "Soporte", mentoria: "Mentoría" } as Record<string, string>;
const ago = (d: string | null) => {
  if (!d) return "Sin actividad";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  return days === 0 ? "Hoy" : days === 1 ? "Ayer" : `Hace ${days} días`;
};

export default async function Alumnas() {
  const db = createAdminClient();
  const [{ data: students }, { data: users }, { count: total }] = await Promise.all([
    db.from("v_students").select("*").order("last_activity", { ascending: false, nullsFirst: false }),
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("lessons").select("id", { count: "exact", head: true }),
  ]);
  const email = new Map(users?.users.map((u) => [u.id, u.email]) ?? []);
  return (
    <main className="mt-6">
      <h1 className="text-[26px] leading-tight">Alumnas</h1>
      <p className="mt-1 text-[15px] text-tinta-2">Mientras no esté el cobro en línea, aquí das acceso a mano: la alumna entra con su correo y su código.</p>
      <div className="mt-5"><GrantForm /></div>
      <ul className="mt-6 divide-y divide-linea overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        {(students ?? []).length === 0 && <li className="p-5 text-[15px] text-gris-texto">Todavía no hay alumnas. Da el primer acceso arriba.</li>}
        {(students ?? []).map((s) => {
          const pct = Math.round((Number(s.lessons_mastered) / (total || 31)) * 100);
          return (
            <li key={s.id} className="flex items-center gap-4 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{s.full_name || email.get(s.id) || "Sin nombre"}</p>
                <p className="truncate text-[13px] text-gris-texto">{email.get(s.id)} · {s.plan_id ? PLAN[s.plan_id] : "Sin acceso"}</p>
              </div>
              <div className="w-28 shrink-0">
                <div className="h-1.5 overflow-hidden rounded-full bg-linea"><div className="h-full bg-bronce" style={{ width: `${pct}%` }} /></div>
                <p className="mt-1 text-[12px] text-gris-texto cifras">{s.lessons_mastered} dominadas</p>
              </div>
              <p className={`w-24 shrink-0 text-right text-[13px] ${s.inactive_7d && s.last_activity ? "text-error" : "text-gris-texto"}`}>{ago(s.last_activity)}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
