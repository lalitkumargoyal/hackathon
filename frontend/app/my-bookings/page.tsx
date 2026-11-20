'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { useBookingCartStore } from '@/store/cartStore';
import Link from 'next/link';

interface Order {
  id: string;
  bookings: Array<{
    id: string;
    hotelId: string;
    name: string;
    price: number;
    nights: number;
    imageUrl: string;
    location: string;
  }>;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    method: string;
    amount: number;
  };
  subtotal: number;
  tax: number;
  total: number;
  totalNights: number;
  createdAt: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

/**
 * My Bookings Page - View all confirmed reservations
 * Features: Order history, booking details, success notifications
 * WCAG AA compliant
 */
export default function MyBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const getTotalNights = useBookingCartStore((state) => state.getTotalNights);
  const totalNights = getTotalNights();

  const handleSearch = useCallback((query: string) => {
    if (query) router.push(`/hotels?q=${encodeURIComponent(query)}`);
  }, [router]);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('hotelsphere-orders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      // Sort by newest first
      parsedOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(parsedOrders);
    }

    // Check for success parameter
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Clear success param after showing
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Cash on Arrival',
      card: 'Credit/Debit Card',
      upi: 'UPI Payment',
      wallet: 'Digital Wallet'
    };
    return labels[method] || method;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || ''}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={totalNights} onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        {/* Success Notification */}
        {showSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-green-900">Booking Confirmed!</h3>
              <p className="text-sm text-green-700">Your reservation has been successfully completed.</p>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="mb-8">
          <h1>My Bookings</h1>
          <p className="text-base text-text-secondary">
            {orders.length === 0 
              ? 'You have no bookings yet' 
              : `You have ${orders.length} ${orders.length === 1 ? 'booking' : 'bookings'}`
            }
          </p>
        </div>

        {orders.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h2 className="mb-2">
                No bookings yet
              </h2>
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
          /* Bookings List */
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-border bg-surface overflow-hidden">
                {/* Order Header */}
                <div className="bg-background px-6 py-4 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-text-primary">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-text-secondary mt-1">
                        Booked on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-primary">
                        ${order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {order.totalNights} {order.totalNights === 1 ? 'night' : 'nights'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  {/* Guest Details */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Guest Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="text-text-secondary">Name:</span>
                        <p className="font-semibold text-text-primary">{order.guest.name}</p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Email:</span>
                        <p className="font-semibold text-text-primary">{order.guest.email}</p>
                      </div>
                      <div>
                        <span className="text-text-secondary">Phone:</span>
                        <p className="font-semibold text-text-primary">{order.guest.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bookings */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">Reservations</h4>
                    <div className="space-y-3">
                      {order.bookings.map((booking) => (
                        <div key={booking.id} className="flex gap-4 p-4 rounded-lg bg-background">
                          <img
                            src={booking.imageUrl}
                            alt={booking.name}
                            className="w-20 h-20 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-text-primary">{booking.name}</h5>
                            <p className="text-sm text-text-secondary">{booking.location}</p>
                            <p className="text-sm text-text-primary mt-1">
                              {booking.nights} {booking.nights === 1 ? 'night' : 'nights'} × ${booking.price.toFixed(2)} = ${(booking.nights * booking.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Price Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Payment Method */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">Payment Method</h4>
                      <div className="p-4 rounded-lg bg-background">
                        <p className="font-semibold text-text-primary">
                          {getPaymentMethodLabel(order.payment.method)}
                        </p>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">Price Breakdown</h4>
                      <div className="p-4 rounded-lg bg-background space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Subtotal:</span>
                          <span className="text-text-primary">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Tax (12%):</span>
                          <span className="text-text-primary">${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-border" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-text-primary">Total:</span>
                          <span className="text-primary">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Hotels Link */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Book More Hotels
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
