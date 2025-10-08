import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      label,
      helperText,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const baseStyles =
      "flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-4 py-2 text-base text-text placeholder:text-text-muted transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-muted";

    const errorStyles = error
      ? "border-danger focus-visible:outline-danger"
      : "";

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text"
          >
            {label}
            {required && (
              <span className="ml-1 text-danger" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(baseStyles, errorStyles, className)}
          ref={ref}
          disabled={disabled}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="text-sm text-danger"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
