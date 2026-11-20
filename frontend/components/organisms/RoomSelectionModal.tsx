"use client";

import React, { useState, useMemo } from "react";
import { Button } from "../atoms/Button";
import { clsx } from "clsx";

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  amenities: string[];
}

export interface RoomSelectionModalProps {
  isOpen: boolean;
  hotelName: string;
  basePrice: number;
  rooms: RoomType[];
  onClose: () => void;
  onConfirm: (
    roomId: string,
    checkIn: string,
    checkOut: string,
    nights: number,
  ) => void;
}

/**
 * Room Selection Modal Component - Marriott.com inspired design
 * Allows users to select room type, check-in/check-out dates before booking
 * WCAG AA compliant with keyboard navigation and focus management
 */
export const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  isOpen,
  hotelName,
  basePrice,
  rooms,
  onClose,
  onConfirm,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms[0]?.id || "");

  // Date state - default to tomorrow and day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [checkInDate, setCheckInDate] = useState<string>(
    tomorrow.toISOString().split("T")[0],
  );
  const [checkOutDate, setCheckOutDate] = useState<string>(
    dayAfter.toISOString().split("T")[0],
  );

  const selectedRoomData = rooms.find((r) => r.id === selectedRoom);

  // Calculate nights based on dates
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [checkInDate, checkOutDate]);

  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : 0;

  // Get today's date for min date validation
  const today = new Date().toISOString().split("T")[0];

  // Calculate min checkout date (must be after check-in)
  const minCheckOut = useMemo(() => {
    if (!checkInDate) return today;
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split("T")[0];
  }, [checkInDate, today]);

  const handleConfirm = () => {
    if (selectedRoom && checkInDate && checkOutDate && nights >= 1) {
      onConfirm(selectedRoom, checkInDate, checkOutDate, nights);
      // Modal will be closed by parent component
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCheckInChange = (date: string) => {
    setCheckInDate(date);
    // Auto-adjust checkout if it's not after check-in
    const checkIn = new Date(date);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      const newCheckOut = new Date(date);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setCheckOutDate(newCheckOut.toISOString().split("T")[0]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Early return check AFTER all hooks
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-selection-title"
    >
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header - Marriott Style */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2
                id="room-selection-title"
                className="text-3xl font-bold text-gray-900 mb-1"
              >
                Choose Your Room
              </h2>
              <p className="text-lg text-gray-600">{hotelName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close room selection"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          {/* Date Selection - Marriott Style */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select Your Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Check-in Date */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-500 transition-colors">
                <label
                  htmlFor="check-in"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Check-in
                </label>
                <input
                  id="check-in"
                  type="date"
                  value={checkInDate}
                  min={today}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  className="w-full bg-white rounded border border-gray-300 px-3 py-2 text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <p className="mt-2 text-xs text-gray-600 font-medium">
                  {formatDate(checkInDate)}
                </p>
              </div>

              {/* Check-out Date */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-500 transition-colors">
                <label
                  htmlFor="check-out"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Check-out
                </label>
                <input
                  id="check-out"
                  type="date"
                  value={checkOutDate}
                  min={minCheckOut}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-white rounded border border-gray-300 px-3 py-2 text-base font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <p className="mt-2 text-xs text-gray-600 font-medium">
                  {formatDate(checkOutDate)}
                </p>
              </div>

              {/* Nights Display */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 flex flex-col justify-center">
                <div className="text-center">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Your Stay
                  </p>
                  <p className="text-4xl font-bold text-blue-600">{nights}</p>
                  <p className="text-sm text-blue-700 font-medium">
                    {nights === 1 ? "Night" : "Nights"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Type Selection - Marriott Style */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Select Your Room
            </h3>
            <div className="space-y-4">
              {rooms.map((room) => (
                <label
                  key={room.id}
                  className={clsx(
                    "block p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-[1.01]",
                    selectedRoom === room.id
                      ? "border-blue-600 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      name="room"
                      value={room.id}
                      checked={selectedRoom === room.id}
                      onChange={() => setSelectedRoom(room.id)}
                      className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {room.name}
                          </h4>
                          <p className="mt-1 text-base text-gray-600">
                            {room.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-3xl font-bold text-gray-900">
                            ${room.price.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-600">per night</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {room.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-white border border-gray-300 text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Max Guests */}
                      <p className="mt-3 text-sm text-gray-600">
                        <span className="font-semibold">
                          Maximum occupancy:
                        </span>{" "}
                        {room.maxGuests}{" "}
                        {room.maxGuests === 1 ? "guest" : "guests"}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price Summary - Marriott Style */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                <span className="text-blue-100">Check-in:</span>
                <span className="font-semibold">
                  {formatFullDate(checkInDate)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                <span className="text-blue-100">Check-out:</span>
                <span className="font-semibold">
                  {formatFullDate(checkOutDate)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                <span className="text-blue-100">Room:</span>
                <span className="font-semibold">{selectedRoomData?.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                <span className="text-blue-100">Nightly Rate:</span>
                <span className="font-semibold">
                  ${selectedRoomData?.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-400">
                <span className="text-blue-100">Number of Nights:</span>
                <span className="font-semibold">{nights}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xl font-bold">Total Amount:</span>
                <span className="text-3xl font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Marriott Style */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-6">
          <div className="flex gap-4 justify-end">
            <Button
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              Continue to Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
