import React from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

/**
 * Atomic Select Component
 * WCAG AA Compliant dropdown for sorting and filtering
 * Includes visible focus states and proper labeling
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      fullWidth = false,
      placeholder,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const hasError = Boolean(error);

    return (
      <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-base font-semibold text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'h-12 w-full appearance-none rounded border bg-background px-4 pr-12',
              'cursor-pointer text-base text-text-primary',
              'transition-colors duration-200',
              'disabled:cursor-not-allowed disabled:opacity-50',
              hasError ? 'border-error' : 'border-text-secondary',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <img src="/icons/chevron-down.svg" alt="" width={20} height={20} />
          </div>
        </div>
        {error && (
          <span
            id={`${selectId}-error`}
            className="text-sm text-red-500"
            role="alert"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span
            id={`${selectId}-helper`}
            className="text-sm text-slate-500"
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
