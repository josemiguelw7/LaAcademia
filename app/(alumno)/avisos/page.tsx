import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Avisos · La Academia" };
export const dynamic = "force-dynamic";

const cuando = (d: string) => {
  const min = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (min < 60) return min <= 1 ? "hace un momento" : `hace ${min} minutos`;
  const h = Math.floor(min / 60);
  if (h < 24) return h === 1 ? "hace una hora" : `hace ${h} horas`;
  const days = Math.floor(h / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
};

export default async function Avisos() {
  const v = await requireViewer();
  const sb = await createClient();
  const { data: items } = await sb.from("notifications").select("id, kind, title, body, href, created_at, read_at").eq("user_id", v.id).order("created_at", { ascending: false }).limit(50);
  // abrir la lista los marca leídos; se ven resaltados solo esta vez
  if (items?.some((n) => !n.read_at)) await sb.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", v.id).is("read_at", null);
  return (
    <main className="px-5 pt-8 sm:px-8">
      <h1 className="text-[26px] leading-tight sm:text-[32px]">Avisos</h1>
      {!items?.length && <p className="mt-4 text-[16px] text-tinta-2">No tienes avisos todavía. Aquí te aviso cuando algo cambie.</p>}
      <ul className="mt-5 space-y-2">
        {(items ?? []).map((n) => {
          const card = (
            <div className={`rounded-tarjeta border p-4 ${n.read_at ? "border-linea bg-blanco" : "border-bronce bg-bronce-suave"}`}>
              <p className="text-[16px] font-semibold">{n.title}</p>
              {n.body && <p className="mt-1 text-[15px] text-tinta-2">{n.body}</p>}
              <p className="mt-1 text-[13px] text-gris-texto">{cuando(n.created_at)}</p>
            </div>
          );
          return <li key={n.id}>{n.href ? <Link href={n.href}>{card}</Link> : card}</li>;
        })}
      </ul>
    </main>
  );
}
