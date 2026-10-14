import { QUESTIONS, type Answers } from "@/lib/questionnaire";

const field = "mt-1 h-12 w-full rounded-boton border border-linea bg-blanco px-3 text-[16px] outline-none focus:border-tinta";

/** Las preguntas del cuestionario, iguales para el graduado y para su cliente. */
export function QuestionnaireFields({ answers }: { answers: Answers }) {
  return (
    <>
      {QUESTIONS.map((q) => (
        <fieldset key={q.id} className="rounded-tarjeta border border-linea bg-blanco p-4">
          <legend className="px-1 text-[16px] font-semibold">{q.label}</legend>
          {"hint" in q && q.hint && <p className="text-[14px] text-gris-texto">{q.hint}</p>}
          {q.type === "choice" && (
            <div className="mt-2 space-y-2">
              {q.options.map((o) => (
                <label key={o.value} className="flex items-center gap-3 text-[15px]">
                  <input type="radio" name={q.id} value={o.value} defaultChecked={answers[q.id] === o.value} className="h-5 w-5 accent-[var(--color-tinta)]" />
                  {o.label}
                </label>
              ))}
            </div>
          )}
          {q.type === "count" && (
            <input type="number" name={q.id} min={0} max={q.max} inputMode="numeric" defaultValue={answers[q.id] === undefined ? "" : String(answers[q.id])} className={`${field} max-w-[120px]`} />
          )}
          {q.type === "yesno" && (
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2 text-[15px]"><input type="radio" name={q.id} value="si" defaultChecked={answers[q.id] === true} className="h-5 w-5 accent-[var(--color-tinta)]" />Sí</label>
              <label className="flex items-center gap-2 text-[15px]"><input type="radio" name={q.id} value="no" defaultChecked={answers[q.id] === false} className="h-5 w-5 accent-[var(--color-tinta)]" />No</label>
            </div>
          )}
        </fieldset>
      ))}
    </>
  );
}
