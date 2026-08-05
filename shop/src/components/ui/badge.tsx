import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-[9.5px] font-bold uppercase tracking-[0.12em] leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // solid garnet overlay chip
        solid: "bg-garnet text-cream px-2.5 py-[5px]",
        // outlined garnet chip
        outline:
          "border border-garnet/45 text-garnet bg-transparent px-[9px] py-1",
        // quiet ink outline
        quiet: "border border-line2 text-ash bg-transparent px-[9px] py-1",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
