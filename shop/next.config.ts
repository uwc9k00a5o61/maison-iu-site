import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  images: {
    // Allow our own trusted SVG placeholder to render through next/image
    // so a missing product shot never leaves a blank card.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Local-disk media is same-origin (/api/media/...) → no config needed.
    // When media is offloaded to an S3/R2 bucket, allow its public host via env.
    remotePatterns: process.env.S3_PUBLIC_HOST
      ? [{ protocol: "https", hostname: process.env.S3_PUBLIC_HOST }]
      : [],
  },
};

export default withPayload(nextConfig);
