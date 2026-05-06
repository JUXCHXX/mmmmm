import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] border border-transparent text-sm font-semibold tracking-[-0.01em] ring-offset-background transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DC89A]/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#0F7A5C_0%,#2DC89A_100%)] text-white shadow-[0_14px_30px_rgba(15,122,92,0.24)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,122,92,0.3)]",
        destructive:
          "bg-[linear-gradient(135deg,#DC2626_0%,#EF4444_100%)] text-white shadow-[0_14px_30px_rgba(220,38,38,0.2)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(220,38,38,0.26)]",
        outline:
          "border-[#D1D9E6] bg-white text-[#0D2654] shadow-[0_8px_20px_rgba(13,38,84,0.06)] hover:-translate-y-0.5 hover:border-[#B8C8DE] hover:bg-[#F8FBFF] hover:shadow-[0_14px_28px_rgba(13,38,84,0.12)]",
        secondary:
          "bg-[linear-gradient(135deg,#0D2654_0%,#1A3F8F_100%)] text-white shadow-[0_14px_30px_rgba(13,38,84,0.2)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(13,38,84,0.26)]",
        ghost: "bg-transparent text-[#0D2654] shadow-none hover:bg-[#0D2654]/6 hover:text-[#0D2654]",
        link: "text-primary underline-offset-4 hover:underline",
        premium:
          "bg-[linear-gradient(135deg,#0D2654_0%,#1A3F8F_45%,#2DC89A_100%)] text-white shadow-[0_16px_34px_rgba(13,38,84,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(13,38,84,0.3)]",
      },
      size: {
        default: "h-11 px-4 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-12 rounded-[16px] px-6 text-base font-semibold",
        icon: "h-11 w-11 rounded-[14px]",
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
