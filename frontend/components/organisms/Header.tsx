'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '../molecules/SearchBar';

export interface HeaderProps {
  cartItemCount?: number;
  onSearch?: (query: string) => void;
}

/**
 * Header Component - Marriott.com inspired design
 * Features: Logo, navigation, search, cart
 * WCAG AA compliant with semantic HTML and ARIA labels
 */
export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-10">
        {/* Top Bar */}
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/hotels"
            className="flex items-center gap-3 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            aria-label="HotelSphere home"
          >
            <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
              <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              HotelSphere
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link
              href="/hotels"
              className="inline-flex min-h-11 items-center text-base font-semibold text-blue-600 border-b-2 border-blue-600 pb-1"
            >
              Explore Hotels
            </Link>
            <Link
              href="/my-bookings"
              className="inline-flex min-h-11 items-center text-base text-gray-700 hover:text-blue-600 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center text-base text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Search & Cart */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden lg:block w-80">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
                placeholder="Search hotels, cities..."
              />
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative rounded-full p-3 hover:bg-gray-100 transition-colors"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg"
                  aria-label={`${cartItemCount} nights in cart`}
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 lg:hidden">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search hotels, cities..."
          />
        </div>
      </div>
    </header>
  );
};
