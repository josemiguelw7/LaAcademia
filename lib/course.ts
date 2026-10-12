import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type LessonStatus = "bloqueada" | "disponible" | "en_progreso" | "dominada";
export type TreeLesson = { id: string; code: string; module: number; position: number; title: string; minutes: number; status: LessonStatus; bestScore: number | null; attempts: number };
export type TreeModule = { position: number; title: string; lessons: TreeLesson[] };

const COURSE = "preparador-de-impuestos";

/** Modules + lessons in order, with the student's derived status (unlock = previous lesson dominada). */
export async function getCourseTree(userId: string, unlockAll = false): Promise<TreeModule[]> {
  const db = createAdminClient();
  const { data: course } = await db.from("courses").select("id").eq("slug", COURSE).single();
  const { data: mods } = await db.from("modules").select("id, position, title, lessons(id, code, position, title, duration_sec)").eq("course_id", course!.id).order("position");
  const { data: prog } = await db.from("lesson_progress").select("lesson_id, status, best_score, attempts").eq("user_id", userId);
  const byLesson = new Map((prog ?? []).map((p) => [p.lesson_id, p]));
  let prevMastered = true;
  return (mods ?? []).map((m) => ({
    position: m.position, title: m.title,
    lessons: [...(m.lessons ?? [])].sort((a, b) => a.position - b.position).map((l) => {
      const p = byLesson.get(l.id);
      const status: LessonStatus = p?.status === "dominada" ? "dominada" : p ? "en_progreso" : prevMastered || unlockAll ? "disponible" : "bloqueada";
      prevMastered = status === "dominada";
      return { id: l.id, code: l.code, module: m.position, position: l.position, title: l.title, minutes: Math.round((l.duration_sec ?? 540) / 60), status, bestScore: p?.best_score ?? null, attempts: p?.attempts ?? 0 };
    }),
  }));
}

export type PlayerQuestion = { id: string; prompt: string; options: { id: string; letter: string; text: string }[] };
export type PlayerSegment = { id: string; position: number; title: string; transcript: string; videoId: string | null; questions: PlayerQuestion[] };
export type PlayerLesson = { id: string; code: string; module: number; moduleTitle: string; position: number; title: string; objective: string | null; threshold: number; checklist: string[]; cifras: string[]; segments: PlayerSegment[] };

/** Lesson for the player. Never includes is_correct or feedback: grading happens in a server action. */
export async function getPlayerLesson(code: string): Promise<PlayerLesson | null> {
  const db = createAdminClient();
  const { data: l } = await db.from("lessons")
    .select("id, code, position, title, objective, mastery_threshold, checklist, cifra_concepts, modules(position, title), segments(id, position, title, transcript, stream_video_id), questions(id, position, prompt, segment_id, options(id, letter, text))")
    .eq("code", code).single();
  if (!l) return null;
  const mod = l.modules as unknown as { position: number; title: string };
  const qs = [...(l.questions ?? [])].sort((a, b) => a.position - b.position);
  return {
    id: l.id, code: l.code, module: mod.position, moduleTitle: mod.title, position: l.position, title: l.title, objective: l.objective,
    threshold: l.mastery_threshold, checklist: (l.checklist as string[]) ?? [], cifras: l.cifra_concepts ?? [],
    segments: [...(l.segments ?? [])].sort((a, b) => a.position - b.position).map((s) => ({
      id: s.id, position: s.position, title: s.title, transcript: s.transcript, videoId: s.stream_video_id,
      questions: qs.filter((q) => q.segment_id === s.id).map((q) => ({ id: q.id, prompt: q.prompt, options: [...(q.options ?? [])].sort((a, b) => a.letter.localeCompare(b.letter)) })),
    })),
  };
}

/** Verified figures for the active year, keyed by concept. */
export async function getCifras(concepts: string[]) {
  if (!concepts.length) return [];
  const db = createAdminClient();
  const { data } = await db.from("cifras").select("concept, filing_status, variant, value, unit, label_es, tax_year, verified_at").in("concept", concepts).eq("tax_year", 2026).order("concept");
  return data ?? [];
}
