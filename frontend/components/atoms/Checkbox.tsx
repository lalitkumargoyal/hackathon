import React from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

/**
 * Atomic Checkbox Component
 * WCAG AA Compliant with visible focus rings
 * Used for category filtering and selections
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              'size-6 shrink-0 cursor-pointer appearance-none rounded border-2 bg-background',
              'bg-center bg-no-repeat',
              'checked:border-primary checked:bg-primary checked:bg-[url("/icons/check.svg")]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError ? 'border-error' : 'border-text-secondary',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="cursor-pointer select-none text-base font-normal text-text-primary"
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <span
            id={`${checkboxId}-error`}
            className="text-sm text-red-500 ml-7"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
