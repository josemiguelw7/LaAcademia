import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const p = request.nextUrl.pathname;
  const protectedPath = ["/curso", "/progreso", "/preparacion", "/leccion", "/practica", "/revision", "/panel", "/demo"].some((x) => p === x || p.startsWith(x + "/"));
  if (protectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("sigue", p);
    return NextResponse.redirect(url);
  }
  // Quien ya entró no vuelve a la pantalla de entrada: directo a su curso.
  if (p === "/entrar" && user) {
    const url = request.nextUrl.clone();
    url.pathname = request.nextUrl.searchParams.get("sigue") || "/curso";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|icon.png|brand/|.*\\.(?:png|jpg|svg|pdf)$).*)"] };
