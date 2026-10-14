import Image from "next/image";
import Link from "next/link";
import { EmailForm, CodeForm } from "./Forms";

export const metadata = { title: "Entrar · La Academia" };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ correo?: string; sigue?: string }> }) {
  const { correo, sigue = "/curso" } = await searchParams;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-12 pt-10">
      <Image src="/brand/logo-horizontal-tinta.png" alt="Liliana Miranda · La Academia" width={170} height={46} className="h-auto w-[160px]" />
      {correo ? (
        <>
          <h1 className="mt-12 text-[26px] leading-tight">Revisa tu correo</h1>
          <p className="mt-3 text-[16px] text-tinta-2">Te mandé un código a <strong className="text-tinta">{correo}</strong>. Escríbelo aquí.</p>
          <CodeForm email={correo} sigue={sigue} />
          <p className="mt-6 text-[14px] text-gris-texto">¿No llegó? Revisa en promociones o spam, o <Link className="font-semibold text-bronce-oscuro underline underline-offset-4" href={`/entrar?sigue=${encodeURIComponent(sigue)}`}>pide otro código</Link>.</p>
        </>
      ) : (
        <>
          {sigue === "/demo" ? (
            <>
              <h1 className="mt-12 text-[26px] leading-tight">Ve una clase completa, gratis</h1>
              <p className="mt-3 text-[16px] text-tinta-2">Escribe tu correo y te mando un código. Con eso entras a una lección entera, con sus preguntas. Sin tarjeta y sin contraseñas.</p>
            </>
          ) : (
            <>
              <h1 className="mt-12 text-[26px] leading-tight">Entra a tu curso</h1>
              <p className="mt-3 text-[16px] text-tinta-2">Escribe tu correo y te mando un código para entrar. Sin contraseñas.</p>
            </>
          )}
          <EmailForm sigue={sigue} />
        </>
      )}
    </main>
  );
}
