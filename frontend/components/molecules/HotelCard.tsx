"use client";

import React from "react";
import { Button } from "../atoms/Button";
import { clsx } from "clsx";

export interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  amenities?: string[];
  onBookNow?: (id: string) => void;
  className?: string;
}

/**
 * Hotel Card Component - Marriott.com inspired design
 * Displays hotel information with booking capability
 * WCAG AA compliant with semantic HTML and ARIA labels
 */
export const HotelCard: React.FC<HotelCardProps> = ({
  id,
  name,
  description,
  location,
  price,
  rating,
  imageUrl,
  amenities = [],
  onBookNow,
  className,
}) => {
  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow(id);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div
        className="flex items-center gap-1"
        aria-label={`${rating} star rating`}
      >
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={clsx(
              "w-5 h-5",
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 fill-current",
            )}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <article
      className={clsx(
        "group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1",
        className,
      )}
    >
      {/* Hotel Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={imageUrl}
          alt={`${name} in ${location}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-gray-600 font-medium">Starting at</p>
          <p className="text-2xl font-bold text-blue-600">
            ${price.toFixed(0)}
          </p>
          <p className="text-xs text-gray-500">per night</p>
        </div>
      </div>

      {/* Hotel Details */}
      <div className="p-6">
        {/* Rating */}
        <div className="mb-3">{renderStars(rating)}</div>

        {/* Hotel Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-2 text-base text-gray-600 mb-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{location}</span>
        </p>

        {/* Description */}
        <p className="text-base text-gray-700 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-200"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-200 my-4" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total for 1 night</p>
            <p className="text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleBookClick}
            aria-label={`Book ${name}`}
            className="bg-blue-600 hover:bg-blue-700 px-8 font-semibold"
          >
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
};
