"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { HotelGrid } from "@/components/organisms/HotelGrid";
import {
  RoomSelectionModal,
  RoomType,
} from "@/components/organisms/RoomSelectionModal";
import { FilterPanel } from "@/components/molecules/FilterPanel";
import { Select } from "@/components/atoms/Select";
import type { SortCriteria } from "@/types/types";
import { useBookingCartStore } from "@/store/cartStore";

// Mock room types for each hotel
const ROOM_TYPES: RoomType[] = [
  {
    id: "standard",
    name: "Standard Room",
    description: "Comfortable room with city views",
    price: 0, // Base price
    maxGuests: 2,
    amenities: ["Free Wi-Fi", "TV", "Mini Bar", "Air Conditioning"],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "Spacious room with premium amenities",
    price: 100, // +$100 from base
    maxGuests: 3,
    amenities: [
      "Free Wi-Fi",
      "TV",
      "Mini Bar",
      "City View",
      "Coffee Maker",
      "Bathrobe",
    ],
  },
  {
    id: "suite",
    name: "Executive Suite",
    description: "Luxurious suite with separate living area",
    price: 250, // +$250 from base
    maxGuests: 4,
    amenities: [
      "Free Wi-Fi",
      "TV",
      "Mini Bar",
      "Panoramic View",
      "Living Room",
      "Kitchenette",
      "Premium Toiletries",
    ],
  },
];

// Mock Marriott hotel data for static UI
const MOCK_HOTELS = [
  {
    id: "1",
    name: "The St. Regis New York",
    price: 895.0,
    rating: 4.9,
    location: "New York, NY",
    imageUrl:
      "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=St.+Regis+NYC",
    category: "Luxury Collection",
    categoryId: "luxury-collection",
    description:
      "Iconic luxury hotel in Midtown Manhattan offering legendary butler service",
  },
  {
    id: "2",
    name: "JW Marriott Marquis Dubai",
    price: 450.0,
    rating: 4.7,
    location: "Dubai, UAE",
    imageUrl: "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=JW+Dubai",
    category: "JW Marriott",
    categoryId: "jw-marriott",
    description:
      "Twin-tower landmark hotel in Business Bay with rooftop dining",
  },
  {
    id: "3",
    name: "Marriott Marquis New York",
    price: 325.0,
    rating: 4.5,
    location: "New York, NY",
    imageUrl:
      "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=Marriott+NYC",
    category: "Marriott Hotels",
    categoryId: "marriott-hotels",
    description:
      "Iconic Times Square hotel with Broadway Theater District access",
  },
  {
    id: "4",
    name: "Courtyard Miami Downtown",
    price: 185.0,
    rating: 4.2,
    location: "Miami, FL",
    imageUrl:
      "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=Courtyard+Miami",
    category: "Courtyard by Marriott",
    categoryId: "courtyard",
    description: "Contemporary hotel in Brickell with rooftop pool",
  },
  {
    id: "5",
    name: "Residence Inn San Francisco Airport",
    price: 165.0,
    rating: 4.1,
    location: "San Francisco, CA",
    imageUrl:
      "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=Residence+SFO",
    category: "Residence Inn",
    categoryId: "residence-inn",
    description:
      "Extended-stay hotel with full kitchens and complimentary breakfast",
  },
  {
    id: "6",
    name: "The Ritz-Carlton, Bali",
    price: 750.0,
    rating: 4.9,
    location: "Nusa Dua, Bali",
    imageUrl: "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=Ritz+Bali",
    category: "Luxury Collection",
    categoryId: "luxury-collection",
    description:
      "Clifftop resort overlooking the Indian Ocean with private villas",
  },
  {
    id: "7",
    name: "JW Marriott Venice Resort & Spa",
    price: 520.0,
    rating: 4.8,
    location: "Venice, Italy",
    imageUrl: "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=JW+Venice",
    category: "JW Marriott",
    categoryId: "jw-marriott",
    description:
      "Private island retreat on Isola delle Rose with Venetian gardens",
  },
  {
    id: "8",
    name: "Courtyard Seattle Downtown",
    price: 215.0,
    rating: 4.4,
    location: "Seattle, WA",
    imageUrl:
      "https://placehold.co/400x400/1E3A8A/FFFFFF/png?text=Courtyard+Seattle",
    category: "Courtyard by Marriott",
    categoryId: "courtyard",
    description: "Urban hotel with waterfront views and modern workspaces",
  },
];

const MARRIOTT_BRANDS = [
  { id: "luxury-collection", name: "Luxury Collection" },
  { id: "jw-marriott", name: "JW Marriott" },
  { id: "marriott-hotels", name: "Marriott Hotels" },
  { id: "courtyard", name: "Courtyard by Marriott" },
  { id: "residence-inn", name: "Residence Inn" },
];

/**
 * Hotels Page - Main hotel discovery interface
 * Features: Search, filter by Marriott brand, sort, and responsive grid
 * WCAG AA compliant with keyboard navigation and screen reader support
 */
export default function HotelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortCriteria>("rating");

  // Room selection modal state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<
    (typeof MOCK_HOTELS)[0] | null
  >(null);

  // Zustand booking cart store
  const addItem = useBookingCartStore((state) => state.addItem);
  const getTotalNights = useBookingCartStore((state) => state.getTotalNights);
  const totalNights = getTotalNights();

  // Handle search with debouncing logic (300ms)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortCriteria);
  }, []);

  // Handle book now - open room selection modal
  const handleBookNow = useCallback((hotelId: string) => {
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId);
    if (hotel) {
      setSelectedHotel(hotel);
      setIsRoomModalOpen(true);
    }
  }, []);

  // Handle room selection confirmation
  const handleRoomConfirm = useCallback(
    (roomId: string, checkIn: string, checkOut: string, nights: number) => {
      if (!selectedHotel) return;

      const roomType = ROOM_TYPES.find((r) => r.id === roomId);
      if (!roomType) return;

      const finalPrice = selectedHotel.price + roomType.price;

      // Add to booking cart with room details and dates
      addItem({
        hotelId: selectedHotel.id,
        name: `${selectedHotel.name} - ${roomType.name}`,
        price: finalPrice,
        imageUrl: selectedHotel.imageUrl,
        location: selectedHotel.location,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        nights: nights,
      });

      // Close the modal
      setIsRoomModalOpen(false);

      console.log(
        `Booked ${selectedHotel.name} - ${roomType.name} from ${checkIn} to ${checkOut} (${nights} nights)`,
      );

      // Navigate to cart page
      router.push("/cart");
    },
    [selectedHotel, addItem, router],
  );

  // Filter and sort hotels
  const filteredAndSortedHotels = useMemo(() => {
    let filtered = MOCK_HOTELS;

    // Apply search filter (name or location)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.location.toLowerCase().includes(query) ||
          hotel.description.toLowerCase().includes(query),
      );
    }

    // Apply brand filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedCategories.includes(hotel.categoryId),
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategories, sortBy]);

  // Get room types with hotel base price
  const roomTypesWithPrice = useMemo(() => {
    if (!selectedHotel) return [];
    return ROOM_TYPES.map((room) => ({
      ...room,
      price: selectedHotel.price + room.price,
    }));
  }, [selectedHotel]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header cartItemCount={totalNights} onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        {/* Hero Section - Marriott Style */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Marriott Hotels
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore luxury stays and unforgettable experiences worldwide.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-80">
            <FilterPanel
              title="Filters"
              sectionLabel="Marriott Brands"
              description="Choose brands to find your perfect stay."
              options={MARRIOTT_BRANDS.map((brand) => ({
                id: brand.id,
                label: brand.name,
              }))}
              selectedIds={selectedCategories}
              onFilterChange={setSelectedCategories}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="pb-1 text-base text-text-secondary">
                {filteredAndSortedHotels.length}{" "}
                {filteredAndSortedHotels.length === 1 ? "hotel" : "hotels"}{" "}
                available
              </p>
              <div className="w-full sm:w-[282px]">
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: "price-asc", label: "Price (Low-High)" },
                    { value: "price-desc", label: "Price (High-Low)" },
                    { value: "rating", label: "Guest Rating" },
                    { value: "name", label: "Alphabetical" },
                  ]}
                />
              </div>
            </div>

            <HotelGrid
              hotels={filteredAndSortedHotels}
              onBookNow={handleBookNow}
              isLoading={false}
            />
            <p className="mt-6 text-center text-sm text-text-secondary">
              Showing all {filteredAndSortedHotels.length} hotels
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Room Selection Modal */}
      {selectedHotel && (
        <RoomSelectionModal
          isOpen={isRoomModalOpen}
          hotelName={selectedHotel.name}
          basePrice={selectedHotel.price}
          rooms={roomTypesWithPrice}
          onClose={() => setIsRoomModalOpen(false)}
          onConfirm={handleRoomConfirm}
        />
      )}
    </div>
  );
}
