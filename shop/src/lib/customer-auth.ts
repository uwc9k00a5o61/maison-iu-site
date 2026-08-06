import "server-only";

import crypto from "crypto";

import { getPayload, generatePayloadCookie, generateExpiredPayloadCookie } from "payload";
import config from "@payload-config";

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const COLLECTION = "customers" as const;

/** True when no real e-mail provider is wired — code is returned/logged. */
export function isDevCodeMode(): boolean {
  return !process.env.RESEND_API_KEY;
}

function generateCode(): string {
  // 6 digits, zero-padded, from a CSPRNG.
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function hashCode(email: string, code: string): string {
  // Bind the hash to the e-mail and server secret so a leaked hash is useless.
  const secret = process.env.PAYLOAD_SECRET || "";
  return crypto
    .createHmac("sha256", secret)
    .update(`${email.toLowerCase()}:${code}`)
    .digest("hex");
}

function randomPassword(): string {
  return crypto.randomBytes(32).toString("hex");
}

function normaliseEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  // Deliberately permissive; the store serves a small, curated audience.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function parseEmail(raw: unknown): string | null {
  return normaliseEmail(raw);
}

/**
 * Issue a fresh 6-digit login code for an e-mail, creating the customer on
 * first request. Returns the code only in dev mode (no e-mail provider);
 * production will send it via Resend and return `code: null`.
 */
export async function requestLoginCode(
  email: string,
): Promise<{ code: string | null }> {
  const payload = await getPayload({ config });
  const code = generateCode();
  const loginCodeHash = hashCode(email, code);
  const loginCodeExpiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString();

  const existing = await payload.find({
    collection: COLLECTION,
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: COLLECTION,
      id: existing.docs[0].id,
      data: { loginCodeHash, loginCodeExpiresAt },
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: COLLECTION,
      data: {
        email,
        password: randomPassword(),
        loginCodeHash,
        loginCodeExpiresAt,
      },
      overrideAccess: true,
    });
  }

  if (isDevCodeMode()) {
    payload.logger.info(`[customer-auth] DEV login code for ${email}: ${code}`);
    return { code };
  }

  // TODO(resend): send the code by e-mail when RESEND_API_KEY is configured.
  payload.logger.info(`[customer-auth] login code issued for ${email}`);
  return { code: null };
}

export interface AuthedCustomer {
  id: string | number;
  email: string;
  name?: string | null;
  cumulativeSpendUsd?: number | null;
}

/**
 * Verify a submitted code. On success rotate the password and mint a real
 * Payload session (token + Set-Cookie). Returns null on any mismatch/expiry.
 */
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<{ cookie: string; customer: AuthedCustomer } | null> {
  const payload = await getPayload({ config });

  const found = await payload.find({
    collection: COLLECTION,
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
    depth: 0,
    showHiddenFields: true,
  });
  const doc = found.docs[0] as
    | { id: string | number; email: string; name?: string | null; cumulativeSpendUsd?: number | null; loginCodeHash?: string | null; loginCodeExpiresAt?: string | null }
    | undefined;
  if (!doc || !doc.loginCodeHash || !doc.loginCodeExpiresAt) return null;

  const expired = new Date(doc.loginCodeExpiresAt).getTime() < Date.now();
  const expected = doc.loginCodeHash;
  const actual = hashCode(email, code);
  const ok =
    !expired &&
    expected.length === actual.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));

  if (!ok) return null;

  // Rotate the password and clear the one-time code, then log in with the
  // new password so Payload issues a correct token/session for us.
  const freshPassword = randomPassword();
  await payload.update({
    collection: COLLECTION,
    id: doc.id,
    data: {
      password: freshPassword,
      loginCodeHash: null,
      loginCodeExpiresAt: null,
    },
    overrideAccess: true,
  });

  const result = await payload.login({
    collection: COLLECTION,
    data: { email, password: freshPassword },
  });

  const token = result.token;
  if (!token) return null;

  const cookie = generatePayloadCookie({
    collectionAuthConfig: payload.collections[COLLECTION].config.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
  });

  return {
    cookie,
    customer: {
      id: doc.id,
      email: doc.email,
      name: doc.name ?? null,
      cumulativeSpendUsd: doc.cumulativeSpendUsd ?? 0,
    },
  };
}

/** Read the currently-authenticated customer from request headers (cookie). */
export async function getCurrentCustomer(
  headers: Headers,
): Promise<AuthedCustomer | null> {
  const payload = await getPayload({ config });
  try {
    const { user } = await payload.auth({ headers });
    if (!user || user.collection !== COLLECTION) return null;
    return {
      id: user.id,
      email: user.email as string,
      name: (user as { name?: string | null }).name ?? null,
      cumulativeSpendUsd:
        (user as { cumulativeSpendUsd?: number | null }).cumulativeSpendUsd ?? 0,
    };
  } catch {
    return null;
  }
}

/** Set-Cookie value that clears the customer session. */
export async function buildLogoutCookie(): Promise<string> {
  const payload = await getPayload({ config });
  return generateExpiredPayloadCookie({
    collectionAuthConfig: payload.collections[COLLECTION].config.auth,
    cookiePrefix: payload.config.cookiePrefix,
  });
}
