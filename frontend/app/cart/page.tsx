"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { BookingItem } from "@/components/molecules/BookingItem";
import { CartSummary } from "@/components/organisms/CartSummary";
import { Button } from "@/components/atoms/Button";
import { useBookingCartStore } from "@/store/cartStore";
import Link from "next/link";

const TAX_RATE = 0.12; // 12% hotel tax rate

/**
 * Booking Cart Page - Hotel booking management interface
 * Features: Update nights, cancel bookings, calculate totals, proceed to checkout
 * WCAG AA compliant with ARIA live regions for cart updates
 */
export default function CartPage() {
  const router = useRouter();

  // Zustand booking cart store
  const items = useBookingCartStore((state) => state.items);
  const updateNights = useBookingCartStore((state) => state.updateNights);
  const removeItem = useBookingCartStore((state) => state.removeItem);
  const getTotalNights = useBookingCartStore((state) => state.getTotalNights);
  const getSubtotal = useBookingCartStore((state) => state.getSubtotal);

  const handleSearch = useCallback(
    (query: string) => {
      if (query) router.push(`/hotels?q=${encodeURIComponent(query)}`);
    },
    [router],
  );

  // Calculate cart totals
  const subtotal = getSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const totalNights = getTotalNights();

  // Handle nights update
  const handleUpdateNights = useCallback(
    (bookingId: string, newNights: number) => {
      if (newNights < 1) return;
      updateNights(bookingId, newNights);
    },
    [updateNights],
  );

  // Handle booking cancellation
  const handleCancelBooking = useCallback(
    (bookingId: string) => {
      removeItem(bookingId);
    },
    [removeItem],
  );

  // Handle checkout - navigate to checkout page
  const handleCheckout = useCallback(() => {
    router.push("/checkout");
  }, [router]);

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalNights} onSearch={handleSearch} />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1>Booking Cart</h1>
          <p className="mt-1 text-base text-text-secondary">
            {isEmpty ? (
              "Your booking cart is empty"
            ) : (
              <>
                You have{" "}
                <span className="font-semibold text-text-primary">
                  {items.length}
                </span>{" "}
                {items.length === 1 ? "reservation" : "reservations"} (
                {totalNights} total nights)
              </>
            )}
          </p>
        </div>

        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center mb-8">
              <svg
                className="mx-auto mb-4 h-24 w-24 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="mb-2">No bookings yet</h2>
              <p className="mb-6 text-text-secondary">
                Start planning your perfect stay!
              </p>
              <Link href="/hotels">
                <Button variant="primary" size="lg">
                  Explore Hotels
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Cart Content */
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Bookings List */}
            <div className="flex-1">
              <div
                className="flex flex-col gap-4"
                role="region"
                aria-label="Hotel bookings"
                aria-live="polite"
              >
                {items.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    id={booking.id}
                    hotelId={booking.hotelId}
                    name={booking.name}
                    location={booking.location}
                    imageUrl={booking.imageUrl}
                    price={booking.price}
                    nights={booking.nights}
                    checkInDate={booking.checkInDate}
                    checkOutDate={booking.checkOutDate}
                    onNightsChange={handleUpdateNights}
                    onRemove={handleCancelBooking}
                  />
                ))}
              </div>

              {/* Continue Browsing Link */}
              <div className="mt-6">
                <Link
                  href="/hotels"
                  className="inline-flex items-center gap-2 rounded text-base font-semibold text-primary"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Exploring Hotels
                </Link>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <aside className="w-full lg:w-96 flex-shrink-0">
              <CartSummary
                subtotal={subtotal}
                estimatedTax={tax}
                total={total}
                itemCount={totalNights}
                onCheckout={handleCheckout}
                isCheckoutDisabled={isEmpty}
              />
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
