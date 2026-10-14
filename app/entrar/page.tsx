import Image from "next/image";
import Link from "next/link";
import { EmailForm, CodeForm } from "./Forms";
import { demoLogin } from "./actions";
import { demoEnabled } from "@/lib/demo-login";
import { DEMO_ACCOUNTS } from "@/lib/demo-seed";

export const metadata = { title: "Entrar · La Academia" };
export const maxDuration = 120; // la primera entrada de demostración carga los datos

export default async function Entrar({ searchParams }: { searchParams: Promise<{ correo?: string; sigue?: string }> }) {
  const { correo, sigue = "/curso" } = await searchParams;
  const demo = await demoEnabled();
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
          {demo && sigue !== "/demo" && (
            <section className="mt-12 rounded-tarjeta border border-dashed border-linea p-4">
              <p className="text-[13px] font-bold uppercase tracking-wide text-gris-texto">Cuentas de demostración</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((a) => (
                  <form key={a.role} action={demoLogin}>
                    <input type="hidden" name="email" value={a.email} />
                    <button className="h-11 w-full rounded-boton border-[1.5px] border-tinta bg-blanco text-[14px] font-semibold capitalize">{a.role}</button>
                  </form>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
