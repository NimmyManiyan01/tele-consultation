import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        verified: "border-brand-blue-300 bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-900/30 dark:text-brand-blue-300",
        success: "border-brand-green-300 bg-brand-green-50 text-brand-green-900 dark:bg-brand-green-900/30 dark:text-brand-green-300",
        warning: "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-300",
        danger: "border-red-300 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-300",
        emergency: "border-red-500 bg-red-600 text-white animate-pulse font-bold",
        schedulex: "border-red-600 bg-red-100 text-red-950 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

