import { NextResponse } from "next/server";

import { parseEmail, verifyLoginCode } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const email = parseEmail((body as { email?: unknown })?.email);
  const rawCode = (body as { code?: unknown })?.code;
  const code = typeof rawCode === "string" ? rawCode.trim() : "";
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: "invalid_input" }, { status: 400 });
  }

  try {
    const result = await verifyLoginCode(email, code);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: "invalid_code" },
        { status: 401 },
      );
    }
    const res = NextResponse.json({ ok: true, user: result.customer });
    res.headers.set("Set-Cookie", result.cookie);
    return res;
  } catch (err) {
    console.error("[auth/verify-code]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
