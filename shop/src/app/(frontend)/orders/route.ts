import { NextResponse } from "next/server";

import { createOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const b = body as {
    items?: unknown;
    contact?: unknown;
    locale?: unknown;
  };

  try {
    const result = await createOrder(
      {
        items: (b.items as { id: string; qty: number }[]) ?? [],
        contact: (b.contact as never) ?? {},
        locale: b.locale === "en" ? "en" : "ru",
      },
      req.headers,
    );
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    // Non-blocking: the storefront ignores failures and still hands off to
    // Telegram/WhatsApp, so a DB hiccup never breaks guest checkout.
    console.error("[orders]", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
