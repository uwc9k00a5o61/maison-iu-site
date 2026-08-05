import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[12px] font-semibold uppercase tracking-[0.14em] transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        // garnet — primary brand CTA
        primary:
          "bg-primary text-primary-foreground hover:bg-garnet2 hover:-translate-y-0.5",
        // foreground outline → inverts on hover (skin-aware)
        outline:
          "border border-fg text-fg hover:bg-fg hover:text-background",
        // ink solid
        ink: "bg-ink text-ivory hover:-translate-y-0.5",
        ghost: "text-ink2 hover:text-garnet",
        link: "text-ink2 hover:text-garnet underline-offset-4 hover:underline tracking-[0.12em]",
      },
      size: {
        default: "min-h-[54px] px-8",
        sm: "min-h-[44px] px-[22px] text-[11px]",
        icon: "size-11 rounded-full p-0 [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
