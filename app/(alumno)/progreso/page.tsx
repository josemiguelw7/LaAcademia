import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { getCourseTree } from "@/lib/course";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Tu progreso · La Academia" };

export default async function Progreso() {
  const v = await requireViewer();
  const tree = await getCourseTree(v.id, v.isStaff);
  const flat = tree.flatMap((m) => m.lessons);
  const done = flat.filter((l) => l.status === "dominada").length;
  const next = flat.find((l) => l.status === "en_progreso") ?? flat.find((l) => l.status === "disponible");
  const { data: streak } = await createAdminClient().from("streaks").select("current_days").eq("user_id", v.id).maybeSingle();
  const pct = Math.round((done / flat.length) * 100);
  const first = done === 0 && !flat.some((l) => l.status === "en_progreso");
  const name = v.fullName?.split(" ")[0];
  return (
    <main className="px-5 pt-8 sm:px-8">
      <h1 className="text-[26px] leading-tight sm:text-[32px]">{name ? `Hola, ${name}` : "Hola"}</h1>
      {next && (
        <Link href={`/leccion/${next.code}`} className="mt-6 block rounded-tarjeta bg-tinta p-5 text-blanco">
          <p className="text-[12px] font-bold text-bronce-suave">{first ? "Empieza aquí" : "Sigue aquí"} · Módulo {next.module}, lección {next.position}</p>
          <p className="mt-2 font-titulo text-[22px] leading-snug">{next.title}</p>
          <p className="mt-4 inline-flex h-11 items-center rounded-boton bg-blanco px-4 text-[15px] font-bold text-tinta">{first ? "Empezar" : "Continuar"} · {next.minutes} min</p>
        </Link>
      )}
      {first && <p className="mt-4 text-[15px] text-tinta-2">«Vamos paso a paso. Una lección a la vez, y yo te acompaño en cada una.» — Liliana</p>}
      <section className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[28px] cifras">{pct}%</p><p className="text-[13px] text-gris-texto">del curso</p></div>
        <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[28px] cifras">{done}<span className="text-[16px] text-gris-texto">/{flat.length}</span></p><p className="text-[13px] text-gris-texto">dominadas</p></div>
        <div className="rounded-tarjeta border border-linea bg-blanco p-4"><p className="font-titulo text-[28px] cifras">{streak?.current_days ?? 0}</p><p className="text-[13px] text-gris-texto">días seguidos</p></div>
      </section>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-linea"><div className="h-full rounded-full bg-bronce" style={{ width: `${pct}%` }} /></div>
      <form action="/salir" method="post" className="mt-10"><button className="text-[14px] font-semibold text-bronce-oscuro underline underline-offset-4">Salir</button></form>
    </main>
  );
}
