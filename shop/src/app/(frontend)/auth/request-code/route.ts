import { NextResponse } from "next/server";

import { isDevCodeMode, parseEmail, requestLoginCode } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const email = parseEmail((body as { email?: unknown })?.email);
  if (!email) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  try {
    const { code } = await requestLoginCode(email);
    // In dev mode (no e-mail provider) we surface the code so the flow is
    // testable end-to-end; production returns devCode: null.
    return NextResponse.json({
      ok: true,
      dev: isDevCodeMode(),
      devCode: code,
    });
  } catch (err) {
    console.error("[auth/request-code]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
