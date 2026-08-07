import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Admins } from "./collections/Admins";
import { Customers } from "./collections/Customers";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Products } from "./collections/Products";

// Cloud storage is opt-in via env. With no S3_* vars set, Media stays on local
// disk (dev/test). Set the vars (S3-compatible bucket — Cloudflare R2 / AWS S3)
// and the same collection is served from the bucket — no code change.
// NB: no official Cloudinary adapter exists for Payload v3; R2/S3 is the
// v3-supported, Cloudinary-like (CDN) path. Never hardcode credentials.
const cloudStoragePlugins = process.env.S3_BUCKET
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || "auto",
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
          },
        },
      }),
    ]
  : [];

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
  collections: [Admins, Customers, Media, Orders, Products],
  plugins: cloudStoragePlugins,
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
