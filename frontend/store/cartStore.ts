import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingItem {
  id: string;
  hotelId: string;
  name: string;
  price: number;
  nights: number;
  imageUrl: string;
  location: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingCartState {
  items: BookingItem[];
  addItem: (item: Omit<BookingItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateNights: (itemId: string, nights: number) => void;
  updateDates: (itemId: string, checkIn: string, checkOut: string) => void;
  clearCart: () => void;
  getTotalNights: () => number;
  getSubtotal: () => number;
}

/**
 * Booking Cart State Store using Zustand
 * Persists cart data to localStorage
 * Manages booking operations: add, remove, update nights/dates, and calculations
 */
export const useBookingCartStore = create<BookingCartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if hotel already exists in cart
          const existingItemIndex = state.items.findIndex(
            (i) => i.hotelId === item.hotelId
          );

          if (existingItemIndex > -1) {
            // Update existing item with new dates and nights
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              nights: item.nights,
              checkInDate: item.checkInDate,
              checkOutDate: item.checkOutDate,
            };
            return { items: updatedItems };
          } else {
            // Add new booking
            const newItem: BookingItem = {
              ...item,
              id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateNights: (itemId, nights) => {
        if (nights < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, nights } : item
          ),
        }));
      },

      updateDates: (itemId, checkIn, checkOut) => {
        set((state) => {
          const checkInDate = new Date(checkIn);
          const checkOutDate = new Date(checkOut);
          const diffTime = checkOutDate.getTime() - checkInDate.getTime();
          const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            items: state.items.map((item) =>
              item.id === itemId
                ? { ...item, checkInDate: checkIn, checkOutDate: checkOut, nights }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalNights: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.nights, 0);
      },

      getSubtotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.nights,
          0
        );
      },
    }),
    {
      name: 'hotelsphere-booking-storage',
    }
  )
);
