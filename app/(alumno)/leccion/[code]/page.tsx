import { notFound, redirect } from "next/navigation";
import { requireViewer } from "@/lib/auth";
import { getCourseTree } from "@/lib/course";
import { buildPlayerLesson } from "@/lib/lesson-view";
import { Player } from "./Player";

export default async function Leccion({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const v = await requireViewer();
  const lesson = await buildPlayerLesson(code, v.isStaff);
  if (!lesson) notFound();
  const tree = await getCourseTree(v.id, v.isStaff);
  const node = tree.flatMap((m) => m.lessons).find((l) => l.code === code);
  if (!node || node.status === "bloqueada") redirect("/curso");
  return <Player lesson={lesson} mastered={node.status === "dominada"} />;
}
