"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

const FALLBACK = "/products/placeholder.svg";

/**
 * next/image with an onError fallback to a neutral branded plinth,
 * so a missing/broken product shot never renders a blank card.
 */
export function ProductImage({ src, alt, ...rest }: ImageProps) {
  const [current, setCurrent] = React.useState(src);
  return (
    <Image
      src={current}
      alt={alt}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
      {...rest}
    />
  );
}
