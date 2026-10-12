import Image from "next/image";
import Link from "next/link";

const links: [string, string][] = [
  ["/#como-funciona", "Cómo funciona"],
  ["/#modulos", "Módulos"],
  ["/#por-dentro", "Por dentro"],
  ["/#testimonios", "Testimonios"],
  ["/precios", "Precios"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-marfil/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Inicio">
          <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={160} height={29} priority className="h-auto w-[140px] sm:w-[160px]" />
        </Link>
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-tinta md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-bronce-oscuro">{label}</Link>
          ))}
        </nav>
        <Link href="/entrar" className="rounded-boton border-[1.5px] border-tinta px-4 py-2 text-[14px] font-semibold text-tinta">
          Entrar
        </Link>
      </div>
    </header>
  );
}
