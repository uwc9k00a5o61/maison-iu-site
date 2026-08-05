"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "@/lib/utils";

/**
 * Editorial single-select filter — text + garnet underline on the active
 * item (brand-skinned, no boxes). Radix gives roving-focus keyboard nav
 * (arrow keys) and correct radiogroup semantics.
 */
function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "-mx-5 flex justify-start gap-6 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "shrink-0 border-b-[1.5px] border-transparent pb-[3px] text-[12px] font-semibold uppercase tracking-[0.14em] text-fg2 outline-none transition-colors hover:text-fg data-[state=on]:border-garnet data-[state=on]:text-garnet",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
