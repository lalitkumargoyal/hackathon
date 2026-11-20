import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'error' | 'rating';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

/**
 * Atomic Badge Component
 * Used for product ratings, category tags, and status indicators
 * WCAG AA compliant with proper contrast ratios
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
}) => {
  const baseStyles = clsx(
    'inline-flex w-fit items-center justify-center',
    'font-medium',
    'transition-colors duration-200'
  );

  const variantStyles = {
    default: 'rounded-sm bg-primary-soft px-2.5 py-1 text-sm font-medium text-primary',
    primary: 'rounded-sm bg-primary-soft px-2.5 py-1 text-sm font-medium text-primary',
    success: 'rounded-full bg-success px-3 py-1 text-text-inverse',
    error: 'rounded-full bg-error px-3 py-1 text-text-inverse',
    rating: 'gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-sm font-semibold text-text-primary',
  };

  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
