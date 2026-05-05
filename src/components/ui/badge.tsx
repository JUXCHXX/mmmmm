import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
        secondary: "border-[#D1D9E6] bg-[#F4F7FB] text-[#0D2654]",
        destructive: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
        success: "border-[#B9E9D8] bg-[#E8F8F3] text-[#15825F]",
        warning: "border-[#FDE68A] bg-[#FFF6DB] text-[#A16207]",
        alert: "border-[#FECACA] bg-[#FEE2E2] text-[#B91C1C]",
        outline: "border-[#D1D9E6] bg-white text-[#0D2654]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
