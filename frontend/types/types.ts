// GraphQL Types for HotelSphere (Marriott International)
export interface Hotel {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
  location: string;
  categoryId: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BookingGraphQL {
  id: string;
  nights: number;
  hotelId: string;
  hotel?: Hotel;
}

// Sort Criteria
export type SortCriteria = 'price-asc' | 'price-desc' | 'rating' | 'name';

// API Response Types
export interface HotelsQueryResponse {
  hotels: Hotel[];
}

export interface CategoriesQueryResponse {
  categories: Category[];
}

export interface HotelQueryResponse {
  hotel: Hotel | null;
}

// Mutation Response Types
export interface AddToCartMutationResponse {
  addToCart: BookingGraphQL;
}

export interface UpdateBookingMutationResponse {
  updateBooking: BookingGraphQL;
}

export interface RemoveBookingMutationResponse {
  removeBooking: boolean;
}
