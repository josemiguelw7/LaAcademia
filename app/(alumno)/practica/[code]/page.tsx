import { notFound, redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { getCourseTree } from "@/lib/course";
import { getCaseForPractice } from "@/lib/practice";
import { ScheduleC } from "./ScheduleC";

export default async function Practica({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await requireViewer();
  const p = await getCaseForPractice(code);
  if (!p || p.form_type !== "schedule_c") notFound();
  const mod = p.modules as unknown as { position: number; title: string };
  const tree = await getCourseTree(v.id, v.isStaff);
  const lessons = tree.find((m) => m.position === mod.position)?.lessons ?? [];
  if (!v.isStaff && lessons.some((l) => l.status !== "dominada")) redirect("/curso");
  const c = [...p.practice_cases].sort((a, b) => a.position - b.position)[0];
  const order = ["1", "4", "9", "10", "20b", "22", "23", "25", "30"];
  const boxes = [...c.practice_boxes].sort((a, b) => order.indexOf(a.line_no) - order.indexOf(b.line_no));
  return <ScheduleC title={p.title} caseTitle={c.title} narrative={c.narrative ?? ""} documents={c.documents as { t: string; d: string }[]} caseId={c.id} boxes={boxes} taxYear={p.tax_year ?? 2026} />;
}
