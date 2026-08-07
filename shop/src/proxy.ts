import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Force the Payload admin to default to the light (Ivory) theme on first
 * visit, while keeping the built-in theme toggle (which writes its own
 * `payload-theme` cookie and overrides this).
 *
 * Payload's theme is "all" (toggle enabled), so with no cookie it falls back
 * to the OS colour scheme — on a dark-mode machine that meant Heritage loaded
 * first. Here, on the first /admin request with no theme cookie, we inject
 * `payload-theme=light` into the request the server renders from AND set it on
 * the response so the client keeps it. The toggle still switches to Heritage.
 */
const THEME_COOKIE = "payload-theme";

export function proxy(req: NextRequest) {
  if (req.cookies.get(THEME_COOKIE)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(req.headers);
  const existingCookie = requestHeaders.get("cookie");
  requestHeaders.set(
    "cookie",
    `${existingCookie ? existingCookie + "; " : ""}${THEME_COOKIE}=light`,
  );
  // Neutralise the client-hint so the server fallback resolves to light too.
  requestHeaders.set("Sec-CH-Prefers-Color-Scheme", "light");

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.cookies.set(THEME_COOKIE, "light", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
