import React from 'react';
import { clsx } from 'clsx';
import { HotelCard, HotelCardProps } from '../molecules/HotelCard';

export interface HotelGridProps {
  hotels: Omit<HotelCardProps, 'onBookNow'>[];
  onBookNow: (hotelId: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Organism HotelGrid Component
 * Responsive grid layout displaying hotel cards
 * Handles loading states and empty states with accessibility
 */
export const HotelGrid: React.FC<HotelGridProps> = ({
  hotels,
  onBookNow,
  isLoading = false,
  emptyMessage = 'No hotels found',
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={clsx('grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3', className)}
        role="status"
        aria-label="Loading hotels"
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

  if (hotels.length === 0) {
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
      aria-label="Hotel list"
    >
      {hotels.map((hotel) => (
        <div key={hotel.id} role="listitem">
          <HotelCard {...hotel} onBookNow={onBookNow} />
        </div>
      ))}
    </div>
  );
};
