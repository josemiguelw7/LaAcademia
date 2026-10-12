import Image from "next/image";
import Link from "next/link";

const redes: [string, string][] = [
  ["https://www.facebook.com/people/Liliana-Miranda/61565082616707/", "Facebook"],
  ["https://www.youtube.com/@LilianaAcademia", "YouTube"],
  ["https://www.instagram.com/lilianaacademia/", "Instagram"],
  ["https://www.tiktok.com/@lilianaacademia", "TikTok"],
];

export default function Footer() {
  return (
    <footer className="bg-tinta text-blanco">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <Image src="/brand/logo-horizontal-negativo.png" alt="Liliana Miranda · La Academia" width={180} height={33} className="h-auto w-[170px]" />
          <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-blanco/70">
            Te enseño a preparar impuestos paso a paso, en tu idioma y con práctica en los formularios de verdad.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce">Contacto</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li><a href="tel:737-775-6793" className="hover:text-bronce">737-775-6793</a></li>
            <li><a href="mailto:liliana@lilianamiranda.com" className="hover:text-bronce">liliana@lilianamiranda.com</a></li>
            <li><a href="https://wa.me/17377756793" className="text-bronce hover:text-bronce-suave">Escríbeme por WhatsApp</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-bronce">Sígueme</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {redes.map(([href, label]) => (
              <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-bronce">{label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-blanco/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[13px] text-blanco/60 md:px-8">
          <p>© {new Date().getFullYear()} Liliana Miranda · La Academia</p>
          <Link href="/entrar" className="hover:text-bronce">¿Ya tienes el curso? Entra aquí</Link>
        </div>
      </div>
    </footer>
  );
}
