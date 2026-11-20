import React from "react";
import { clsx } from "clsx";
import { Button } from "../atoms/Button";

export interface BookingItemProps {
  id: string;
  hotelId: string;
  name: string;
  location: string;
  price: number;
  nights: number;
  imageUrl: string;
  checkInDate?: string;
  checkOutDate?: string;
  onNightsChange: (bookingId: string, newNights: number) => void;
  onRemove: (bookingId: string) => void;
  isUpdating?: boolean;
  className?: string;
}

/**
 * Molecular BookingItem Component
 * Displays booking with hotel thumbnail, name, location, price, nights controls, and cancel button
 * WCAG AA compliant with proper labels and interactive controls
 */
export const BookingItem: React.FC<BookingItemProps> = ({
  id,
  hotelId,
  name,
  location,
  price,
  nights,
  imageUrl,
  checkInDate,
  checkOutDate,
  onNightsChange,
  onRemove,
  isUpdating = false,
  className,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const handleIncrement = () => {
    onNightsChange(id, nights + 1);
  };

  const handleDecrement = () => {
    if (nights > 1) {
      onNightsChange(id, nights - 1);
    }
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const bookingTotal = price * nights;

  return (
    <div
      className={clsx(
        "flex items-center gap-6 rounded-lg border border-border bg-surface p-6",
        "transition-opacity duration-200",
        isUpdating && "opacity-50",
        className,
      )}
    >
      <img
        src={imageUrl}
        alt={`${name} in ${location}`}
        width={112}
        height={112}
        className="size-28 shrink-0 rounded object-cover"
        loading="lazy"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="text-xl font-semibold leading-normal text-text-primary">
          {name}
        </h3>
        <p className="text-base text-text-secondary flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {location}
        </p>
        {checkInDate && checkOutDate && (
          <p className="text-sm text-text-secondary flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(checkInDate)} - {formatDate(checkOutDate)}
          </p>
        )}
        <p className="text-base text-text-primary">
          ${price.toFixed(2)} per night
        </p>
      </div>

      <div className="flex w-44 shrink-0 flex-col gap-2">
        <span className="text-sm font-semibold text-text-primary">Nights</span>
        <div className="flex h-12 items-center overflow-hidden rounded border border-text-secondary bg-background">
          <button
            onClick={handleDecrement}
            disabled={nights <= 1 || isUpdating}
            className="flex size-12 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Decrease nights"
            type="button"
          >
            <img src="/icons/minus.svg" alt="" width={20} height={20} />
          </button>
          <span
            className="flex size-12 items-center justify-center border-x border-border text-base font-semibold text-text-primary"
            aria-label={`Nights: ${nights}`}
          >
            {nights}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isUpdating}
            className="flex size-12 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Increase nights"
            type="button"
          >
            <img src="/icons/plus.svg" alt="" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="flex w-40 shrink-0 flex-col gap-2">
        <p className="text-sm text-text-secondary">Booking total</p>
        <p className="text-2xl font-semibold leading-normal text-text-primary">
          ${bookingTotal.toFixed(2)}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRemove}
          disabled={isUpdating}
          aria-label={`Cancel booking for ${name}`}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
