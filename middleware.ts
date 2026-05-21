import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isSupabaseConfigured = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

/**
 * Hält die Supabase-Session frisch — refresht das Access-Token via Cookies
 * vor jedem Request. Bei nicht konfiguriertem Supabase wird nichts gemacht.
 */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  const response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Triggert Session-Refresh, sofern nötig.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match alle Requests außer:
     * - _next/static (statische Dateien)
     * - _next/image (Image Optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Assets mit Extension (.png, .svg, .css, …)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
