/**
 * Operator DB init — materialises the Payload schema on the target database
 * and seeds the catalogue, without the Payload CLI (which cannot load the
 * TS config under Node ≥22 due to require()-of-ESM with top-level await).
 *
 * Run from /shop with the schema-push opt-in:
 *   PAYLOAD_DB_PUSH=true node --import tsx/esm scripts/db-init.mts
 *
 * `.env` (DATABASE_URL, PAYLOAD_SECRET) is loaded automatically by getPayload.
 * PAYLOAD_DB_PUSH=true makes the postgres adapter sync tables on init; this
 * flag is NEVER set in the deployed service, so production stays push-off.
 */
import { getPayload } from "payload";

import { seedDatabase } from "../src/seed-core.ts";

const run = async (): Promise<void> => {
  // tsx loads the config as CJS, which double-wraps the default export
  // through ESM interop (mod.default.default). Unwrap defensively. The
  // deployed runtime imports the config normally via withPayload.
  const mod = (await import("../src/payload.config.ts")) as {
    default: unknown;
  };
  const inner = (mod.default as { default?: unknown })?.default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = (inner ?? mod.default) as any;

  const payload = await getPayload({ config });
  payload.logger.info("Payload initialised — schema ensured.");
  await seedDatabase(payload);
  payload.logger.info("DB init complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error("DB init failed:", err);
  process.exit(1);
});
