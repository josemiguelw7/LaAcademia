import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const LESSONS_DIR = path.join(process.cwd(), "content", "lessons");

export type Option = { id: string; text: string; correct: boolean; feedback: string };
export type Question = { id: string; after_segment: number; concept_tag: string; prompt: string; options: Option[] };
export type Segment = { n: number; title: string; html: string };
export type LessonMeta = {
  id: string; module: number; lesson: number; slug: string; title: string; objective: string;
  duration_min: number; status: "draft" | "review" | "approved" | "recorded";
  cifras: string[]; practice: string | null; checklist: string[];
};
export type Lesson = LessonMeta & { questions: Question[]; segments: Segment[] };

export const MODULE_TITLES: Record<number, string> = {
  1: "Fundamentos", 2: "Registro y ética", 3: "La familia fiscal", 4: "Ingresos",
  5: "Deducciones y créditos", 6: "El Anexo C", 7: "Errores y cartas del IRS", 8: "Tu primera temporada",
};

function files(): string[] {
  return fs.readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => fs.readdirSync(path.join(LESSONS_DIR, d.name))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => path.join(LESSONS_DIR, d.name, f)))
    .sort();
}

function renderBody(md: string): Segment[] {
  // <Cifra concept="x" .../> → chip; the app shows the year's figure from the cifras table
  const withChips = md.replace(/<Cifra concept="([^"]+)"[^>]*\/>/g,
    (_m, c) => `<span class="cifra">tarjeta: ${String(c).replace(/_/g, " ")}</span>`);
  const parts = withChips.split(/^## S(\d+) · (.+)$/m);
  const segs: Segment[] = [];
  for (let i = 1; i < parts.length; i += 3) {
    segs.push({ n: Number(parts[i]), title: parts[i + 1].trim(), html: marked.parse(parts[i + 2], { async: false }) as string });
  }
  return segs;
}

export function getLessons(): Lesson[] {
  return files().map((f) => {
    const { data, content } = matter(fs.readFileSync(f, "utf8"));
    return { ...(data as LessonMeta), cifras: data.cifras ?? [], checklist: data.checklist ?? [],
      questions: (data.questions ?? []) as Question[], segments: renderBody(content) };
  }).sort((a, b) => a.module - b.module || a.lesson - b.lesson);
}

export function getLesson(id: string): Lesson | undefined {
  return getLessons().find((l) => l.id === id);
}
