"use server";
import { revalidatePath } from "next/cache";
import { requireViewer } from "@/lib/auth";
import { seedDemo, clearDemo } from "@/lib/demo-seed";

type State = { error: string | null; done?: string } | null;

export async function loadDemo(): Promise<State> {
  const v = await requireViewer();
  if (v.role !== "admin") return { error: "Solo el administrador carga la demostración." };
  try {
    await seedDemo(v.email);
    revalidatePath("/panel/demo");
    return { error: null, done: "Listo: cuentas y datos de demostración cargados." };
  } catch (e) {
    console.error("demo seed", e);
    return { error: "No pude cargar la demostración. Revisa los registros de Vercel." };
  }
}

export async function removeDemo(): Promise<State> {
  const v = await requireViewer();
  if (v.role !== "admin") return { error: "Solo el administrador borra la demostración." };
  await clearDemo();
  revalidatePath("/panel/demo");
  return { error: null, done: "Demostración borrada." };
}
