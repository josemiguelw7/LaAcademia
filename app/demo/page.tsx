import { notFound, redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { getDemoCode } from "@/lib/demo";
import { buildPlayerLesson } from "@/lib/lesson-view";
import { createAdminClient } from "@/lib/supabase/admin";
import { Player } from "@/app/(alumno)/leccion/[code]/Player";

export const metadata = { title: "Una clase gratis · La Academia" };

/** Una lección completa para quien todavía no compra: basta con crear cuenta. */
export default async function Demo() {
  const v = await requireViewer();
  const code = await getDemoCode();
  if (!code) notFound();
  if (v.hasAccess) redirect(`/leccion/${code}`);
  const lesson = await buildPlayerLesson(code, false);
  if (!lesson) notFound();
  const db = createAdminClient();
  const { data: prog } = await db.from("lesson_progress").select("status").eq("user_id", v.id).eq("lesson_id", lesson.id).maybeSingle();
  await db.from("events").insert({ user_id: v.id, name: "demo_opened", props: { lesson: code } });
  return (
    <div className="mx-auto min-h-dvh max-w-2xl pb-12">
      <Player lesson={lesson} mastered={prog?.status === "dominada"} demo />
    </div>
  );
}
