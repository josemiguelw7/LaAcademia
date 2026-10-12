"use server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseTree } from "@/lib/course";

async function viewerId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");
  return user.id;
}

async function canAccess(userId: string, lessonId: string) {
  const db = createAdminClient();
  const { data: profile } = await db.from("profiles").select("role").eq("id", userId).single();
  const staff = profile?.role === "directora" || profile?.role === "admin";
  if (!staff) {
    const { count } = await db.from("purchases").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "paid");
    if (!count) return false;
  }
  const tree = await getCourseTree(userId, staff);
  const lesson = tree.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
  return !!lesson && lesson.status !== "bloqueada";
}

export async function startAttempt(lessonId: string) {
  const userId = await viewerId();
  if (!(await canAccess(userId, lessonId))) throw new Error("locked");
  const db = createAdminClient();
  const { data, error } = await db.from("attempts").insert({ user_id: userId, lesson_id: lessonId }).select("id").single();
  if (error) throw error;
  await db.from("lesson_progress").upsert({ user_id: userId, lesson_id: lessonId, status: "en_progreso" }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true });
  return data.id as string;
}

export type AnswerResult = { isCorrect: boolean; feedback: string; correctOptionId: string };

export async function answerQuestion(attemptId: string, questionId: string, optionId: string): Promise<AnswerResult> {
  const userId = await viewerId();
  const db = createAdminClient();
  const { data: attempt } = await db.from("attempts").select("id, user_id, lesson_id, finished_at").eq("id", attemptId).single();
  if (!attempt || attempt.user_id !== userId || attempt.finished_at) throw new Error("bad attempt");
  const { data: q } = await db.from("questions").select("id, lesson_id, options(id, is_correct, feedback)").eq("id", questionId).single();
  if (!q || q.lesson_id !== attempt.lesson_id) throw new Error("bad question");
  const chosen = q.options.find((o) => o.id === optionId);
  const correct = q.options.find((o) => o.is_correct)!;
  if (!chosen) throw new Error("bad option");
  // first answer counts; re-answering the same question in an attempt is ignored
  await db.from("attempt_answers").upsert({ attempt_id: attemptId, question_id: questionId, option_id: optionId, is_correct: chosen.is_correct }, { onConflict: "attempt_id,question_id", ignoreDuplicates: true });
  await db.from("events").insert({ user_id: userId, name: "question_answered", props: { question_id: questionId, correct: chosen.is_correct } });
  return { isCorrect: chosen.is_correct, feedback: chosen.feedback, correctOptionId: correct.id };
}

export type FinishResult = { score: number; total: number; passed: boolean; threshold: number; nextCode: string | null };

export async function finishAttempt(attemptId: string): Promise<FinishResult> {
  const userId = await viewerId();
  const db = createAdminClient();
  const { data: attempt } = await db.from("attempts").select("id, user_id, lesson_id, finished_at").eq("id", attemptId).single();
  if (!attempt || attempt.user_id !== userId) throw new Error("bad attempt");
  const { data: lesson } = await db.from("lessons").select("id, mastery_threshold, questions_per_attempt").eq("id", attempt.lesson_id).single();
  const { data: answers } = await db.from("attempt_answers").select("is_correct").eq("attempt_id", attemptId);
  const score = (answers ?? []).filter((a) => a.is_correct).length;
  const total = lesson!.questions_per_attempt;
  const passed = score >= lesson!.mastery_threshold;
  const now = new Date().toISOString();
  if (!attempt.finished_at) {
    await db.from("attempts").update({ finished_at: now, score, passed }).eq("id", attemptId);
    const { data: prev } = await db.from("lesson_progress").select("status, best_score, attempts").eq("user_id", userId).eq("lesson_id", attempt.lesson_id).single();
    const already = prev?.status === "dominada";
    await db.from("lesson_progress").upsert({
      user_id: userId, lesson_id: attempt.lesson_id,
      status: already || passed ? "dominada" : "en_progreso",
      best_score: Math.max(prev?.best_score ?? 0, score), last_score: score, attempts: (prev?.attempts ?? 0) + 1,
      ...(passed && !already ? { mastered_at: now } : {}),
    }, { onConflict: "user_id,lesson_id" });
    await touchStreak(userId);
  }
  const tree = await getCourseTree(userId);
  const flat = tree.flatMap((m) => m.lessons);
  const idx = flat.findIndex((l) => l.id === attempt.lesson_id);
  return { score, total, passed, threshold: lesson!.mastery_threshold, nextCode: flat[idx + 1]?.code ?? null };
}

async function touchStreak(userId: string) {
  const db = createAdminClient();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const { data: s } = await db.from("streaks").select("*").eq("user_id", userId).maybeSingle();
  if (s?.last_active_date === today) return;
  const yesterday = new Date(Date.now() - 864e5).toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const current = s?.last_active_date === yesterday ? s.current_days + 1 : 1;
  await db.from("streaks").upsert({ user_id: userId, current_days: current, longest_days: Math.max(s?.longest_days ?? 0, current), last_active_date: today });
}
