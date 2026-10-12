"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav({ isStaff }: { isStaff: boolean }) {
  const p = usePathname();
  const items = [
    { href: "/progreso", label: "Progreso" },
    { href: "/curso", label: "Curso" },
    ...(isStaff ? [{ href: "/revision", label: "Guiones" }] : []),
  ];
  if (p.startsWith("/leccion")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-linea bg-blanco pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-2xl">
        {items.map((i) => {
          const on = p === i.href || p.startsWith(i.href + "/");
          return (
            <li key={i.href} className="flex-1">
              <Link href={i.href} className={`flex h-14 items-center justify-center text-[14px] font-semibold ${on ? "text-tinta" : "text-gris-texto"}`}>
                <span className={on ? "border-b-2 border-bronce pb-1" : "pb-1"}>{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
