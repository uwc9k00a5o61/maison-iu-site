import { NextResponse } from "next/server";

// Plain-text deploy marker. Bump BUILD_MARKER on each deploy and curl
// /build-marker after Render finishes to confirm the live build is fresh
// (guards against Render serving a stale cached build).
export const dynamic = "force-static";

const BUILD_MARKER = "MIU-FRONTEND-M5-home-landing";

export function GET() {
  return new NextResponse(`${BUILD_MARKER}\n`, {
    status: 200,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
