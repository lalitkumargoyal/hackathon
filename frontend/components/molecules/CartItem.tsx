import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../atoms/Button';

export interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onQuantityChange: (cartItemId: string, newQuantity: number) => void;
  onRemove: (cartItemId: string) => void;
  isUpdating?: boolean;
  className?: string;
}

/**
 * Molecular CartItem Component
 * Displays cart item with thumbnail, name, price, quantity controls, and remove button
 * WCAG AA compliant with proper labels and interactive controls
 */
export const CartItem: React.FC<CartItemProps> = ({
  id,
  productId,
  name,
  price,
  quantity,
  imageUrl,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  className,
}) => {
  const handleIncrement = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const itemTotal = price * quantity;

  return (
    <div
      className={clsx(
        'flex items-center gap-6 rounded-lg border border-border bg-surface p-6',
        'transition-opacity duration-200',
        isUpdating && 'opacity-50',
        className
      )}
    >
      <img
        src={imageUrl}
        alt={name}
        width={112}
        height={112}
        className="size-28 shrink-0 rounded object-cover"
        loading="lazy"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-xl font-semibold leading-normal text-text-primary">{name}</h3>
        <p className="text-base text-text-primary">Unit price: ${price.toFixed(2)}</p>
      </div>

      <div className="flex w-44 shrink-0 flex-col gap-2">
        <span className="text-sm font-semibold text-text-primary">Quantity</span>
        <div className="flex h-12 items-center overflow-hidden rounded border border-text-secondary bg-background">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1 || isUpdating}
            className="flex size-12 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease quantity"
            type="button"
          >
            <img src="/icons/minus.svg" alt="" width={20} height={20} />
          </button>
          <span
            className="flex size-12 items-center justify-center border-x border-border text-base font-semibold text-text-primary"
            aria-label={`Quantity: ${quantity}`}
          >
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isUpdating}
            className="flex size-12 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase quantity"
            type="button"
          >
            <img src="/icons/plus.svg" alt="" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="flex w-40 shrink-0 flex-col gap-2">
        <p className="text-sm text-text-secondary">Item total</p>
        <p className="text-2xl font-semibold leading-normal text-text-primary">
          ${itemTotal.toFixed(2)}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRemove}
          disabled={isUpdating}
          aria-label={`Remove ${name} from cart`}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
