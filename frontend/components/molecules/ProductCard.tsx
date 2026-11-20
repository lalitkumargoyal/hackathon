import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  category: string;
  onAddToCart: (productId: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Molecular ProductCard Component
 * Combines Image, Category Badge, Product Name, Rating, Price, and Add to Cart Button
 * WCAG AA compliant with proper image alt text and interactive elements
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  rating,
  imageUrl,
  category,
  onAddToCart,
  isLoading = false,
  className,
}) => {
  const handleAddToCart = () => {
    onAddToCart(id);
  };

  return (
    <article
      className={clsx(
        'flex flex-col gap-4 rounded-lg border border-border bg-surface p-5',
        className
      )}
    >
      <div className="rounded bg-background p-2">
        <img
          src={imageUrl}
          alt={name}
          className="h-56 w-full rounded object-cover"
          loading="lazy"
        />
      </div>

      <Badge variant="primary">{category}</Badge>

      <h3 className="text-xl font-semibold leading-normal text-text-primary">
        {name}
      </h3>

      <Badge variant="rating">
        <img src="/icons/star.svg" alt="" width={16} height={16} />
        {rating.toFixed(1)} out of 5
      </Badge>

      <p className="text-2xl font-semibold leading-normal text-text-primary">
        ${price.toFixed(2)}
      </p>

      <Button
        variant="primary"
        size="md"
        fullWidth
        onClick={handleAddToCart}
        isLoading={isLoading}
        aria-label={`Add ${name} to cart`}
      >
        Add to Cart
      </Button>
    </article>
  );
};
