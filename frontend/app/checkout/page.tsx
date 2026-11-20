'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { useBookingCartStore } from '@/store/cartStore';
import { clsx } from 'clsx';

type PaymentMethod = 'cash' | 'card' | 'upi' | 'wallet';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cash',
    name: 'Cash on Arrival',
    description: 'Pay at the hotel front desk',
    icon: '💵',
    enabled: true,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Coming soon',
    icon: '💳',
    enabled: false,
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    description: 'Coming soon',
    icon: '📱',
    enabled: false,
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'Coming soon',
    icon: '👛',
    enabled: false,
  },
];

const TAX_RATE = 0.12; // 12% hotel tax

/**
 * Checkout Page - Payment and order completion
 * Features: Payment method selection, order summary, complete booking
 * WCAG AA compliant
 */
export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Booking cart store
  const items = useBookingCartStore((state) => state.items);
  const clearCart = useBookingCartStore((state) => state.clearCart);
  const getTotalNights = useBookingCartStore((state) => state.getTotalNights);
  const getSubtotal = useBookingCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const totalNights = getTotalNights();

  const handleSearch = useCallback((query: string) => {
    if (query) router.push(`/hotels?q=${encodeURIComponent(query)}`);
  }, [router]);

  const handleCompleteOrder = useCallback(() => {
    if (!guestName || !guestEmail || !guestPhone) {
      alert('Please fill in all guest details');
      return;
    }

    if (items.length === 0) {
      alert('Your booking cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        bookings: items,
        guest: {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        },
        payment: {
          method: selectedPayment,
          amount: total,
        },
        subtotal,
        tax,
        total,
        totalNights,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };

      // Store order in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('hotelsphere-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('hotelsphere-orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      setIsProcessing(false);

      // Redirect to bookings page
      router.push('/my-bookings?success=true');
    }, 2000);
  }, [guestName, guestEmail, guestPhone, items, selectedPayment, subtotal, tax, total, totalNights, clearCart, router]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={0} onSearch={handleSearch} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-10">
          <div className="text-center">
            <h1 className="mb-4">Your cart is empty</h1>
            <p className="text-text-secondary mb-6">Add some hotels to your booking cart to proceed</p>
            <Button variant="primary" size="lg" onClick={() => router.push('/hotels')}>
              Explore Hotels
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalNights} onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        <div className="mb-8">
          <h1>Checkout</h1>
          <p className="text-base text-text-secondary">
            Complete your booking in just a few steps
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Guest Details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Details */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Guest Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full rounded border border-border bg-background px-4 py-3 text-base"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full rounded border border-border bg-background px-4 py-3 text-base"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-text-primary mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded border border-border bg-background px-4 py-3 text-base"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={clsx(
                      'flex items-start gap-4 p-4 rounded-lg border-2 transition-all',
                      option.enabled
                        ? 'cursor-pointer hover:border-primary/50'
                        : 'cursor-not-allowed opacity-60',
                      selectedPayment === option.id && option.enabled
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={selectedPayment === option.id}
                      onChange={() => option.enabled && setSelectedPayment(option.id)}
                      disabled={!option.enabled}
                      className="mt-1 w-5 h-5 text-primary disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {option.name}
                          </h3>
                          <p className="text-sm text-text-secondary">{option.description}</p>
                        </div>
                      </div>
                    </div>
                    {!option.enabled && (
                      <span className="px-3 py-1 text-xs rounded-full bg-background text-text-secondary">
                        Coming Soon
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-surface p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Order Summary</h2>
              
              {/* Booking Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-border">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-text-secondary">{item.location}</p>
                      <p className="text-sm text-text-primary mt-1">
                        {item.nights} {item.nights === 1 ? 'night' : 'nights'} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-4 border-t border-border">
                <div className="flex justify-between text-base">
                  <span className="text-text-secondary">Subtotal:</span>
                  <span className="text-text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-text-secondary">Taxes & Fees (12%):</span>
                  <span className="text-text-primary">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-text-primary">Total:</span>
                  <span className="font-semibold text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Total nights: {totalNights}
                </p>
              </div>

              {/* Complete Order Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCompleteOrder}
                isLoading={isProcessing}
                className="mt-4"
              >
                {isProcessing ? 'Processing...' : 'Complete Booking'}
              </Button>

              <p className="text-xs text-center text-text-secondary mt-4">
                By completing this booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
