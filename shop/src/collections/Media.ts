import path from "path";

import type { CollectionConfig } from "payload";

/**
 * Media — uploaded imagery (real product photography). Public read so the
 * storefront can render the files. Stored on local disk by default (dev/test);
 * when S3-compatible env vars are set the s3Storage plugin (payload.config)
 * transparently offloads the same collection to the bucket — no code change.
 *
 * imageSizes generate responsive variants (thumbnail / card / hero) so the
 * storefront serves right-sized images.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { en: "Media", ru: "Медиа" },
    plural: { en: "Media", ru: "Медиа" },
  },
  admin: {
    group: { en: "Catalogue", ru: "Каталог" },
    useAsTitle: "filename",
  },
  access: {
    read: () => true, // storefront needs to load the files
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "media-uploads"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    imageSizes: [
      { name: "thumbnail", width: 200, height: 200, position: "centre" },
      { name: "card", width: 640, height: 800, position: "centre" },
      { name: "hero", width: 1200, height: 1500, position: "centre" },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: { en: "Alt text", ru: "Описание (alt)" },
      admin: {
        description: {
          en: "Short description for accessibility / SEO.",
          ru: "Краткое описание для доступности и SEO.",
        },
      },
    },
  ],
};
