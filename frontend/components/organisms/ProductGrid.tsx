import React from 'react';
import { clsx } from 'clsx';
import { ProductCard, ProductCardProps } from '../molecules/ProductCard';

export interface ProductGridProps {
  products: Omit<ProductCardProps, 'onAddToCart'>[];
  onAddToCart: (productId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Organism ProductGrid Component
 * Responsive grid layout displaying product cards
 * Handles loading states and empty states with accessibility
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  isLoading = false,
  emptyMessage = 'No products found',
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx('grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3', className)}
        role="status"
        aria-label="Loading products"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={clsx(
          'flex flex-col items-center justify-center py-16 px-4',
          className
        )}
        role="status"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-slate-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-lg font-medium text-slate-500">{emptyMessage}</p>
        <p className="text-sm text-slate-500 mt-2">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx('grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3', className)}
      role="list"
      aria-label="Product list"
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard {...product} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
};
