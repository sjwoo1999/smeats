import * as React from "react";
import { cn } from "@/lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "white";
}

const sizeClasses = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

const variantClasses = {
  primary: "border-primary border-t-transparent",
  secondary: "border-secondary border-t-transparent",
  white: "border-white border-t-transparent",
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", variant = "primary", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="로딩 중"
        className={cn("inline-block", className)}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        <span className="sr-only">로딩 중...</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";
