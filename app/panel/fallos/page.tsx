import { createAdminClient } from "@/lib/supabase/admin";

export default async function Fallos() {
  const { data } = await createAdminClient().from("v_failed_questions_30d").select("*").gte("answers", 3).order("fail_pct", { ascending: false }).limit(50);
  return (
    <main className="mt-6">
      <h1 className="text-[26px] leading-tight">Las preguntas que más se fallan</h1>
      <p className="mt-1 text-[15px] text-tinta-2">Últimos 30 días, con al menos 3 respuestas. Si una pasa del 50 %, quizá el guion necesita otra explicación.</p>
      <ul className="mt-6 divide-y divide-linea overflow-hidden rounded-tarjeta border border-linea bg-blanco">
        {(data ?? []).length === 0 && <li className="p-5 text-[15px] text-gris-texto">Todavía no hay suficientes respuestas.</li>}
        {(data ?? []).map((q) => (
          <li key={q.question_id} className="flex items-start gap-4 px-4 py-3.5">
            <p className={`w-14 shrink-0 font-titulo text-[22px] cifras ${Number(q.fail_pct) > 50 ? "text-error" : "text-tinta"}`}>{Math.round(Number(q.fail_pct))}%</p>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{q.prompt}</p>
              <p className="text-[13px] text-gris-texto">Lección {q.lesson_code.replace("-", ".").replace(/^0/, "")} · {q.concept_tag} · {q.answers} respuestas</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
