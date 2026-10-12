import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";

export const metadata: Metadata = { title: "Revisión de guiones · La Academia", robots: { index: false, follow: false } };

export default async function RevisionLayout({ children }: { children: React.ReactNode }) {
  const v = await requireViewer();
  if (!v.isStaff) redirect("/curso");
  return <div className="mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8">{children}</div>;
}
