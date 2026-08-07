import { NextResponse } from "next/server";

import { getCurrentCustomer } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const customer = await getCurrentCustomer(req.headers);
  return NextResponse.json({ user: customer });
}
