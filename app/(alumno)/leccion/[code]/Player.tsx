"use client";
import Link from "next/link";
import { useState, useTransition, useEffect, useRef } from "react";
import type { PlayerLesson, PlayerSegment } from "@/lib/course";
import { startAttempt, answerQuestion, finishAttempt, type AnswerResult, type FinishResult } from "./actions";

const DOWNLOADS: Record<string, { href: string; title: string }> = {
  "pdf-checklist-intake": { href: "/descargas/lo-que-le-pides-a-tu-cliente.pdf", title: "Lo que le pides a tu cliente" },
  "pdf-checklist-revision": { href: "/descargas/checklist-de-60-segundos.pdf", title: "El checklist de 60 segundos" },
};
type Seg = PlayerSegment & { html: string };
type Step = { kind: "segment"; seg: number } | { kind: "question"; seg: number; q: number };

export function Player({ lesson, mastered, demo = false }: { lesson: PlayerLesson & { segments: Seg[] }; mastered: boolean; demo?: boolean }) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>({ kind: "segment", seg: 0 });
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [final, setFinal] = useState<FinishResult | null>(null);
  const [pending, start] = useTransition();
  const top = useRef<HTMLDivElement>(null);
  const totalQ = lesson.segments.reduce((n, s) => n + s.questions.length, 0);

  useEffect(() => { start(async () => setAttemptId(await startAttempt(lesson.id))); }, [lesson.id]);
  useEffect(() => { top.current?.scrollIntoView({ block: "start" }); }, [step, final]);

  const seg = lesson.segments[step.seg];
  const advance = () => {
    setPicked(null); setResult(null);
    if (step.kind === "segment" && seg.questions.length) return setStep({ kind: "question", seg: step.seg, q: 0 });
    if (step.kind === "question" && step.q + 1 < seg.questions.length) return setStep({ kind: "question", seg: step.seg, q: step.q + 1 });
    if (step.seg + 1 < lesson.segments.length) return setStep({ kind: "segment", seg: step.seg + 1 });
    start(async () => setFinal(await finishAttempt(attemptId!)));
  };
  const check = () => {
    if (!picked || !attemptId || step.kind !== "question") return;
    const q = seg.questions[step.q];
    start(async () => {
      const r = await answerQuestion(attemptId, q.id, picked);
      setResult(r); setAnswered((n) => n + 1); if (r.isCorrect) setCorrectCount((n) => n + 1);
    });
  };

  const header = (
    <header className="sticky top-0 z-10 border-b border-linea bg-marfil/95 px-5 pb-3 pt-4 backdrop-blur sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <Link href={demo ? "/" : "/curso"} className="text-[14px] font-semibold text-bronce-oscuro">{demo ? "← Inicio" : "← Curso"}</Link>
        <span className="text-[13px] font-semibold text-gris-texto cifras">{answered}/{totalQ} preguntas</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-linea"><div className="h-full rounded-full bg-bronce transition-[width]" style={{ width: `${(answered / totalQ) * 100}%` }} /></div>
    </header>
  );

  if (final) {
    const ok = final.passed;
    return (
      <div ref={top}>{header}
        <main className="px-5 pt-10 sm:px-8">
          <p className={`font-titulo text-[56px] leading-none cifras ${ok ? "text-tinta" : "text-bronce-oscuro"}`}>{final.score}<span className="text-[28px] text-gris-texto">/{final.total}</span></p>
          <h1 className="mt-4 text-[26px] leading-tight">{ok ? "Lección dominada" : "Vas bien, todavía no la dominas"}</h1>
          <p className="mt-3 text-[16px] text-tinta-2">
            {demo
              ? ok ? "Lo tienes. Así es cada lección del curso: te explico, te pregunto y avanzas cuando lo dominas."
                   : `Para dominarla necesitas ${final.threshold} de ${final.total}. Así funciona todo el curso: repites hasta que lo dominas, y cada intento cuenta.`
              : ok ? "Lo tienes. La siguiente lección ya está abierta."
                   : `Para dominarla necesitas ${final.threshold} de ${final.total}. Vuelve a ver los segmentos donde fallaste y repítela: cada intento cuenta.`}
          </p>
          <div className="mt-8 space-y-3">
            {demo
              ? <Link href="/precios" className="flex h-[52px] items-center justify-center rounded-boton bg-tinta text-[15px] font-bold text-blanco">Ver los tres niveles</Link>
              : ok && final.nextCode
              ? <Link href={`/leccion/${final.nextCode}`} className="flex h-[52px] items-center justify-center rounded-boton bg-tinta text-[15px] font-bold text-blanco">Siguiente lección</Link>
              : <button onClick={() => location.reload()} className="h-[52px] w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco">Repetir la lección</button>}
            {demo
              ? !ok && <button onClick={() => location.reload()} className="h-[52px] w-full rounded-boton border-[1.5px] border-linea bg-blanco text-[15px] font-semibold">Repetir la lección</button>
              : <Link href="/curso" className="flex h-[52px] items-center justify-center rounded-boton border-[1.5px] border-linea bg-blanco text-[15px] font-semibold">Volver al curso</Link>}
          </div>
          {DOWNLOADS[lesson.practiceCode ?? ""] && (
            <a href={DOWNLOADS[lesson.practiceCode!].href} download className="mt-8 flex items-center justify-between rounded-tarjeta border border-bronce bg-bronce-suave p-4">
              <span><span className="block text-[12px] font-bold text-bronce-oscuro">PDF para imprimir</span><span className="text-[16px] font-semibold">{DOWNLOADS[lesson.practiceCode!].title}</span></span>
              <span className="text-[14px] font-semibold text-bronce-oscuro">Descargar</span>
            </a>
          )}
          {lesson.checklist.length > 0 && (
            <section className="mt-10 rounded-tarjeta border border-linea bg-blanco p-5">
              <h2 className="font-cuerpo text-[16px] font-bold">Lo que te llevas de esta lección</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] text-tinta-2">{lesson.checklist.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </section>
          )}
        </main>
      </div>
    );
  }

  if (step.kind === "segment") {
    return (
      <div ref={top}>{header}
        <main className="px-5 pt-6 sm:px-8">
          {step.seg === 0 && (
            <>
              <p className="text-[13px] font-semibold text-gris-texto">Módulo {lesson.module} · {lesson.moduleTitle} · Lección {lesson.position}</p>
              <h1 className="mt-1 text-[26px] leading-tight sm:text-[32px]">{lesson.title}</h1>
              {mastered && <p className="mt-2 inline-block rounded-full bg-tinta px-2.5 py-0.5 text-[12px] font-semibold text-blanco">★ Ya la dominaste · repaso</p>}
            </>
          )}
          <div className="mt-5 flex aspect-video flex-col items-center justify-center rounded-tarjeta px-6 text-center" style={{ background: "linear-gradient(180deg,#2B2926 0%,#1C1B19 100%)" }}>
            {seg.videoId ? <p className="text-blanco">Video</p> : (<>
              <p className="font-titulo text-[20px] text-blanco">{step.seg + 1}. {seg.title}</p>
              <p className="mt-2 text-[13px] text-bronce-suave">El video de Liliana está en producción. Por ahora, lee el guion.</p>
            </>)}
          </div>
          <article className="guion mt-6 text-[17px]" dangerouslySetInnerHTML={{ __html: seg.html }} />
          <button onClick={advance} disabled={pending || !attemptId} className="mt-6 h-[52px] w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco disabled:bg-deshabilitado-bg disabled:text-deshabilitado-fg">
            {seg.questions.length ? "Responder la pregunta" : "Continuar"}
          </button>
        </main>
      </div>
    );
  }

  const q = seg.questions[step.q];
  return (
    <div ref={top}>{header}
      <main className="px-5 pt-6 sm:px-8">
        <p className="text-[13px] font-semibold text-gris-texto">Pregunta {answered + (result ? 0 : 1)} de {totalQ}</p>
        <h2 className="mt-2 text-[22px] leading-snug">{q.prompt}</h2>
        <ul className="mt-5 space-y-3">
          {q.options.map((o) => {
            const isPicked = picked === o.id;
            let cls = "border-linea bg-blanco";
            if (result) {
              if (o.id === result.correctOptionId) cls = "border-correcto bg-correcto-suave";
              else if (isPicked) cls = "border-error bg-error-suave";
              else cls = "border-linea bg-blanco opacity-70";
            } else if (isPicked) cls = "border-tinta bg-blanco shadow-opcion";
            return (
              <li key={o.id}>
                <button disabled={!!result || pending} onClick={() => setPicked(o.id)} className={`w-full rounded-boton border-[1.5px] p-4 text-left text-[15px] font-medium ${cls}`}>
                  <span className="mr-2 font-bold uppercase">{o.letter}.</span>{o.text}
                </button>
              </li>
            );
          })}
        </ul>
        {result && (
          <p className={`mt-5 rounded-boton p-4 text-[15px] ${result.isCorrect ? "bg-correcto-suave text-correcto" : "bg-error-suave text-error"}`}>{result.feedback}</p>
        )}
        {result
          ? <button onClick={advance} disabled={pending} className="mt-6 h-[52px] w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco">Continuar</button>
          : <button onClick={check} disabled={!picked || pending} className="mt-6 h-[52px] w-full rounded-boton bg-tinta text-[15px] font-bold text-blanco disabled:bg-deshabilitado-bg disabled:text-deshabilitado-fg">Revisar</button>}
      </main>
    </div>
  );
}
