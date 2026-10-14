"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav({ isStaff, hasPlatform, unread }: { isStaff: boolean; hasPlatform: boolean; unread: number }) {
  const p = usePathname();
  const items = [
    { href: "/progreso", label: "Progreso" },
    { href: "/curso", label: "Curso" },
    { href: "/preparacion", label: "Preparación" },
    ...(hasPlatform ? [{ href: "/negocio", label: "Mi negocio" }] : []),
    { href: "/avisos", label: "Avisos" },
    ...(isStaff ? [{ href: "/panel", label: "Panel" }] : []),
  ];
  if (p.startsWith("/leccion") || p.startsWith("/practica")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-linea bg-blanco pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-2xl">
        {items.map((i) => {
          const on = p === i.href || p.startsWith(i.href + "/");
          return (
            <li key={i.href} className="flex-1">
              <Link href={i.href} className={`flex h-14 items-center justify-center text-[14px] font-semibold ${on ? "text-tinta" : "text-gris-texto"}`}>
                <span className={`relative ${on ? "border-b-2 border-bronce pb-1" : "pb-1"}`}>{i.label}{i.href === "/avisos" && unread > 0 && <span aria-label={`${unread} sin leer`} className="absolute -right-3 -top-1 h-2.5 w-2.5 rounded-full bg-bronce" />}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
