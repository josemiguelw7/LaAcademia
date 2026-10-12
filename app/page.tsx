import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={220} height={60} priority className="h-auto w-[200px]" />
      <h1 className="mt-10 text-[32px] leading-[1.1] sm:text-[44px]">Acceso directo a mí, en tu idioma.</h1>
      <p className="mt-5 max-w-[52ch] text-[17px] text-tinta-2">
        Te enseño a preparar impuestos paso a paso, con casos reales y práctica en los formularios de verdad.
        La nueva Academia abre muy pronto.
      </p>
      <p className="mt-8 text-[13px] text-gris-texto">— Liliana Miranda</p>
      <Link href="/entrar" className="mt-10 text-[15px] font-semibold text-bronce-oscuro underline underline-offset-4">¿Ya tienes el curso? Entra aquí</Link>
    </main>
  );
}
