import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { PanelTabs } from "./PanelTabs";

export const metadata: Metadata = { title: "Panel · La Academia", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const v = await requireViewer();
  if (!v.isStaff) redirect("/curso");
  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-6 sm:px-8">
      <div className="flex items-center justify-between">
        <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={150} height={40} className="h-auto w-[140px]" />
        <a href="/curso" className="text-[14px] font-semibold text-bronce-oscuro">Ver el curso</a>
      </div>
      <PanelTabs />
      {children}
    </div>
  );
}
