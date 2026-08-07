/**
 * Seed / re-sync the Payload database from the static catalogue.
 *
 * Idiomatic entry (requires a Node build that can load the Payload CLI):
 *   npx payload run src/seed.ts
 *
 * On Node ≥22 where the CLI's require()-of-ESM path breaks, use the operator
 * script instead: `node --import tsx/esm scripts/db-init.mts`.
 */
import { getPayload } from "payload";
import config from "@payload-config";

import { seedDatabase } from "./seed-core";

const run = async (): Promise<void> => {
  const payload = await getPayload({ config });
  await seedDatabase(payload);
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
