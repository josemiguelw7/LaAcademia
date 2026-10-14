import { NextResponse } from "next/server";
import { runPurge } from "@/lib/export";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Cron diario de Vercel. Solo corre con el secreto de cron. */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("No autorizado", { status: 401 });
  return NextResponse.json(await runPurge());
}
