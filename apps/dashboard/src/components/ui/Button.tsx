import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-deep shadow-sm",
        outline:
          "border-hairline bg-canvas hover:bg-surface-soft hover:text-ink aria-expanded:bg-surface-soft aria-expanded:text-ink",
        secondary:
          "bg-surface-soft text-ink hover:bg-hairline aria-expanded:bg-surface-soft aria-expanded:text-ink",
        ghost:
          "hover:bg-surface-soft hover:text-ink aria-expanded:bg-surface-soft aria-expanded:text-ink",
        destructive:
          "bg-error/10 text-error hover:bg-error/20 focus-visible:border-error/40 focus-visible:ring-error/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8 gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-9 px-5 text-sm gap-1.5",
        lg: "h-13 px-10 text-base gap-2.5",
        icon: "size-11",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
