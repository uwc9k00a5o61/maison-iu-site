import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Telegram Login — STUB. Until TELEGRAM_BOT_TOKEN is provided this endpoint
 * reports that Telegram sign-in is not configured, without ever blocking the
 * e-mail flow or guest checkout. When the token lands, verify the Telegram
 * auth payload hash here (HMAC-SHA256 of the data-check-string with a key of
 * SHA256(bot_token)), then find-or-create a Customer by telegramId and mint a
 * session cookie exactly like verify-code does.
 */
export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
  });
}

export async function POST() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({
      ok: false,
      configured: false,
      reason: "telegram_not_configured",
    });
  }
  // Token present but verification not yet implemented — fail closed, never
  // block other auth paths.
  return NextResponse.json(
    { ok: false, configured: true, reason: "not_implemented" },
    { status: 501 },
  );
}
