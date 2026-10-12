import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Fallback for the magic link in the email (same browser). The 6-digit code is the main path on phones.
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const sigue = url.searchParams.get("sigue") ?? "/curso";
  const next = sigue.startsWith("/") && !sigue.startsWith("//") ? sigue : "/curso";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/entrar", url.origin));
}
