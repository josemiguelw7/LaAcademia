"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [{ href: "/panel", label: "Alumnas" }, { href: "/panel/revisiones", label: "Revisiones" }, { href: "/panel/fallos", label: "Fallos" }, { href: "/panel/cifras", label: "Cifras del año" }, { href: "/revision", label: "Guiones" }];
export function PanelTabs() {
  const p = usePathname();
  return (
    <nav className="mt-6 flex gap-1 overflow-x-auto border-b border-linea">
      {TABS.map((t) => {
        const on = t.href === "/panel" ? p === t.href : p === t.href || p.startsWith(t.href + "/");
        return <Link key={t.href} href={t.href} className={`whitespace-nowrap px-3 pb-2.5 text-[14px] font-semibold ${on ? "border-b-2 border-bronce text-tinta" : "text-gris-texto"}`}>{t.label}</Link>;
      })}
    </nav>
  );
}
