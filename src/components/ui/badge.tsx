import * as React from "react";
import { cn } from "@/lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors";

    const variantStyles = {
      default:
        "bg-neutral-100 text-neutral-900 border border-neutral-200",
      success: "bg-success-bg text-success border border-success/20",
      warning: "bg-warning-bg text-warning border border-warning/20",
      danger: "bg-danger-bg text-danger border border-danger/20",
      info: "bg-info-bg text-info border border-info/20",
    };

    const sizeStyles = {
      sm: "h-5 px-2 text-xs rounded-[var(--radius-xs)]",
      md: "h-6 px-3 text-sm rounded-[var(--radius-sm)]",
    };

    return (
      <span
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
