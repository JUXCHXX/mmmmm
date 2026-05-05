import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DC89A]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#2DC89A] text-white shadow-[0_8px_18px_rgba(45,200,154,0.28)] hover:bg-[#24B98D] hover:shadow-[0_12px_24px_rgba(45,200,154,0.32)]",
        destructive: "bg-[#EF4444] text-white shadow-[0_8px_18px_rgba(239,68,68,0.22)] hover:bg-[#DC2626] hover:shadow-[0_12px_24px_rgba(239,68,68,0.28)]",
        outline: "border border-[#0D2654] text-[#0D2654] bg-transparent hover:bg-[#0D2654]/6",
        secondary: "bg-[#0D2654] text-white shadow-[0_8px_18px_rgba(13,38,84,0.18)] hover:bg-[#15346F]",
        ghost: "text-[#0D2654] hover:bg-[#0D2654]/6 hover:text-[#0D2654]",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-[#2DC89A] text-white shadow-[0_10px_22px_rgba(45,200,154,0.3)] hover:bg-[#24B98D] hover:shadow-[0_14px_28px_rgba(45,200,154,0.34)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base font-semibold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
