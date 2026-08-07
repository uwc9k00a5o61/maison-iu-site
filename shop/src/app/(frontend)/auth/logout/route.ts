import { NextResponse } from "next/server";

import { buildLogoutCookie } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", await buildLogoutCookie());
  return res;
}
