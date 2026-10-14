import Link from "next/link";
import { requireViewer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { PREP_STEPS, daysUntil, fechaLarga } from "@/lib/prep";
import { togglePrepStep } from "./actions";

export const metadata = { title: "Tu preparación · La Academia" };

export default async function Preparacion() {
  const v = await requireViewer();
  const sb = await createClient();
  const [{ data: rows }, { data: setting }] = await Promise.all([
    sb.from("prep_steps").select("step, done_at").eq("user_id", v.id),
    sb.from("settings").select("value").eq("key", "efin_deadline").maybeSingle(),
  ]);
  const done = new Set((rows ?? []).map((r) => r.step as string));
  const deadline = typeof setting?.value === "string" ? setting.value : null;
  const left = deadline ? daysUntil(deadline) : null;
  const efinSent = done.has("efin_solicitud") || done.has("efin_aprobado");
  const count = PREP_STEPS.filter((s) => done.has(s.id)).length;

  return (
    <main className="px-5 pt-8 sm:px-8">
      <h1 className="text-[26px] leading-tight sm:text-[32px]">Tu preparación para la temporada</h1>
      <p className="mt-3 text-[16px] text-tinta-2">
        Antes de tu primer cliente necesitas tu PTIN y, para enviar tú misma las declaraciones, tu EFIN. Aquí vamos paso a paso.
      </p>

      {deadline && left !== null && !efinSent && (
        <section className="mt-6 rounded-tarjeta bg-tinta p-5 text-blanco">
          <p className="text-[12px] font-bold text-bronce-suave">Tu fecha para pedir el EFIN</p>
          <p className="mt-2 font-titulo text-[22px] leading-snug">Envía tu solicitud antes del {fechaLarga(deadline)}</p>
          <p className="mt-3 text-[15px] text-bronce-suave">
            {left > 1 && `Faltan ${left} días. `}
            {left === 1 && "Falta un día. "}
            {left === 0 && "Es hoy. "}
            {left < 0
              ? "La fecha ya pasó. Pídelo igual: si no llega a tiempo, esta temporada preparas y la próxima envías con tu propio EFIN."
              : "El IRS puede tardar hasta 45 días en aprobarlo, y la temporada empieza en enero."}
          </p>
        </section>
      )}

      <p className="mt-6 text-[13px] font-bold text-gris-texto">{count} de {PREP_STEPS.length} pasos listos</p>
      <ol className="mt-3 space-y-3">
        {PREP_STEPS.map((s, i) => {
          const isDone = done.has(s.id);
          return (
            <li key={s.id} className={`rounded-tarjeta border p-4 ${isDone ? "border-correcto bg-correcto-suave" : "border-linea bg-blanco"}`}>
              <div className="flex items-start gap-3">
                <form action={togglePrepStep}>
                  <input type="hidden" name="step" value={s.id} />
                  <input type="hidden" name="done" value={isDone ? "1" : "0"} />
                  <button
                    aria-label={isDone ? `Desmarcar: ${s.title}` : `Marcar como listo: ${s.title}`}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-bold ${isDone ? "border-correcto bg-correcto text-blanco" : "border-gris-piedra text-transparent"}`}
                  >
                    ✓
                  </button>
                </form>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-gris-texto">
                    Paso {i + 1}{s.efin ? " · EFIN" : ""}
                  </p>
                  <p className={`text-[17px] font-semibold ${isDone ? "text-tinta-2" : "text-tinta"}`}>{s.title}</p>
                  <p className="mt-1 text-[15px] text-tinta-2">{s.body}</p>
                  {(s.link || s.lesson) && (
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-semibold">
                      {s.link && (
                        <a href={s.link.href} target="_blank" rel="noopener noreferrer" className="text-bronce-oscuro underline underline-offset-4">
                          {s.link.label}
                        </a>
                      )}
                      {s.lesson && (
                        <Link href={`/leccion/${s.lesson.code}`} className="text-bronce-oscuro underline underline-offset-4">
                          {s.lesson.label}
                        </Link>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-[15px] text-tinta-2">«Si te atoras en algún paso, pregúntame. Esto lo he hecho muchas veces.» — Liliana</p>
    </main>
  );
}
