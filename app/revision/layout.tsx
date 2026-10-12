import type { Metadata } from "next";
export const metadata: Metadata = { title: "Revisión de guiones · La Academia", robots: { index: false, follow: false } };
export default function RevisionLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8">{children}</div>;
}
