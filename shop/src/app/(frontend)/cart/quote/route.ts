import { NextResponse } from "next/server";

import { quoteCart } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  try {
    const quote = await quoteCart((body as { items?: unknown })?.items, req.headers);
    return NextResponse.json({ ok: true, quote });
  } catch (err) {
    console.error("[cart/quote]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
