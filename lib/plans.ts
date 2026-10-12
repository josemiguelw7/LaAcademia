import "server-only";
import { createClient } from "@supabase/supabase-js";

export type Plan = {
  id: "curso" | "soporte" | "mentoria" | string;
  name: string;
  price_cents: number;
  whatsapp_access: "none" | "season" | "year" | string;
  group_sessions: boolean;
  calls_per_month: number;
  return_reviews: number;
  seats: number | null;
};

/** Los planes tienen lectura pública por RLS; cliente anónimo sin sesión. */
export async function getPlans(): Promise<Plan[]> {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await sb.from("plans").select("*").order("price_cents", { ascending: true });
  if (error) return [];
  return (data ?? []) as Plan[];
}

export const precio = (cents: number) => `$${Math.round(cents / 100).toLocaleString("en-US")}`;

export const waInscripcion = (plan: string) =>
  `https://wa.me/17377756793?text=${encodeURIComponent(`Hola Liliana, quiero inscribirme en «${plan}». ¿Cuál es el siguiente paso?`)}`;
