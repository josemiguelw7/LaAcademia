import Image from "next/image";
import { requireViewer } from "@/lib/auth";
import { BottomNav } from "./BottomNav";
import { createClient } from "@/lib/supabase/server";
import { AccountBar } from "@/components/AccountBar";

export default async function AlumnoLayout({ children }: { children: React.ReactNode }) {
  const v = await requireViewer();
  if (!v.hasAccess) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-10">
        <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={160} height={44} className="h-auto w-[150px]" />
        <h1 className="mt-12 text-[26px] leading-tight">Ya casi estás adentro</h1>
        <p className="mt-3 text-[16px] text-tinta-2">Tu cuenta ({v.email}) todavía no tiene el curso activo. Si ya lo compraste, escríbeme y lo reviso.</p>
        <form action="/salir" method="post" className="mt-8"><button className="text-[14px] font-semibold text-bronce-oscuro underline underline-offset-4">Entrar con otro correo</button></form>
      </main>
    );
  }
  const sb = await createClient();
  const { count: unread } = await sb.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", v.id).is("read_at", null);
  return (
    <div className="mx-auto min-h-dvh max-w-2xl pb-24">
      <AccountBar v={v} className="px-5 pt-3 sm:px-8" />
      {children}
      <BottomNav isStaff={v.isStaff} hasPlatform={v.hasPlatform} unread={unread ?? 0} />
    </div>
  );
}
