import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow our own trusted SVG placeholder to render through next/image
    // so a missing product shot never leaves a blank card.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
