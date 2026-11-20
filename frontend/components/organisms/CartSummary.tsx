import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../atoms/Button';

export interface CartSummaryProps {
  subtotal: number;
  estimatedTax: number;
  total: number;
  itemCount: number;
  onCheckout?: () => void;
  isCheckoutDisabled?: boolean;
  className?: string;
}

/**
 * Organism CartSummary Component
 * Displays order summary with subtotal, tax, and total
 * Includes checkout button (note: checkout is out of scope)
 * WCAG AA compliant with proper semantic structure
 */
export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  estimatedTax,
  total,
  itemCount,
  onCheckout,
  isCheckoutDisabled = false,
  className,
}) => {
  const taxRate = 0.08; // 8% tax rate
  const calculatedTax = estimatedTax || subtotal * taxRate;
  const calculatedTotal = total || subtotal + calculatedTax;

  return (
    <aside
      className={clsx(
        'rounded-lg border border-border bg-surface p-6',
        'sticky top-24',
        className
      )}
      aria-label="Order summary"
    >
      <h2 className="mb-4 text-xl font-semibold text-text-primary">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-base text-text-secondary">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-base font-semibold text-text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base text-text-secondary">Estimated Tax</span>
          <span className="text-base font-semibold text-text-primary">
            ${calculatedTax.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-text-primary">Order Total</span>
            <span className="text-lg font-semibold text-primary">
              ${calculatedTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onCheckout}
        disabled={isCheckoutDisabled || itemCount === 0}
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </Button>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-text-secondary">
        Tax and shipping calculated at checkout
      </p>
    </aside>
  );
};
