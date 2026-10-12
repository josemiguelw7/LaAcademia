import type { LessonStatus } from "@/lib/course";

/** Circle state marker: dominada = tinta ★, en progreso = bronce, disponible = outline, bloqueada = línea. */
export function LessonNode({ status, n }: { status: LessonStatus; n: string }) {
  const base = "flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold cifras";
  if (status === "dominada") return <span className={`${base} bg-tinta text-blanco`} aria-label="Dominada">★</span>;
  if (status === "en_progreso") return <span className={`${base} border-2 border-bronce bg-bronce-suave text-bronce-oscuro`}>{n}</span>;
  if (status === "disponible") return <span className={`${base} border-2 border-tinta bg-blanco text-tinta`}>{n}</span>;
  return <span className={`${base} bg-deshabilitado-bg text-deshabilitado-fg`} aria-label="Bloqueada">{n}</span>;
}
