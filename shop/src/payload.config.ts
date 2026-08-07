import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Admins } from "./collections/Admins";
import { Customers } from "./collections/Customers";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "· MAISON IU",
    },
    components: {
      graphics: {
        Logo: "/components/admin/MaisonLogo#MaisonLogo",
        Icon: "/components/admin/MaisonIcon#MaisonIcon",
      },
    },
  },
  collections: [Admins, Customers, Orders, Products],
  // Admin panel language: Russian by default (fallback), English available.
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: "ru",
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      // Render managed Postgres requires TLS. Its cert chain is not in the
      // default Node trust store, so verify is relaxed (trusted network).
      // Opt out with DATABASE_SSL_DISABLED=true for a local plaintext DB.
      ssl:
        process.env.DATABASE_SSL_DISABLED === "true"
          ? false
          : { rejectUnauthorized: false },
    },
    // Production-safe: never auto-sync schema against the live DB at runtime.
    // Schema is materialised out-of-band by an operator script that opts in
    // via PAYLOAD_DB_PUSH=true (see scripts/db-init.mts).
    push: process.env.PAYLOAD_DB_PUSH === "true",
  }),
  sharp,
});
