/**
 * Type definitions for HotelSphere GraphQL API
 * Provides strict TypeScript typing for all GraphQL operations
 */

import { PrismaClient, Hotel as PrismaHotel, Category as PrismaCategory, Booking as PrismaBooking } from '@prisma/client';

// ============================================================================
// DATABASE CONTEXT
// ============================================================================

/**
 * GraphQL context containing database client and request metadata
 */
export interface GraphQLContext {
  prisma: PrismaClient;
}

// ============================================================================
// DOMAIN MODELS - Match Prisma schema with strict typing
// ============================================================================

/**
 * Category entity from database (Marriott brands)
 */
export type Category = PrismaCategory;

/**
 * Hotel entity from database with category relation
 */
export type Hotel = PrismaHotel;

/**
 * Booking entity from database with hotel relation
 */
export type Booking = PrismaBooking;

/**
 * Hotel with populated category relation
 */
export interface HotelWithCategory extends PrismaHotel {
  category: PrismaCategory;
}

/**
 * Booking with populated hotel and category relations
 */
export interface BookingWithHotel extends PrismaBooking {
  hotel: HotelWithCategory;
}

// ============================================================================
// QUERY INPUT TYPES
// ============================================================================

/**
 * Filter options for hotel discovery queries
 */
export interface HotelFilterInput {
  /** Filter by Marriott brand slug */
  category?: string | null;
  /** Minimum nightly rate threshold */
  minPrice?: number | null;
  /** Maximum nightly rate threshold */
  maxPrice?: number | null;
  /** Search term for hotel name or location */
  search?: string | null;
}

/**
 * Sorting options for hotel queries
 */
export enum HotelSortOption {
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  RATING_DESC = 'RATING_DESC',
  NAME_ASC = 'NAME_ASC'
}

/**
 * Complete hotel query parameters with filtering, sorting, and pagination
 */
export interface HotelQueryInput {
  filter?: HotelFilterInput | null;
  sortBy?: HotelSortOption | null;
  limit?: number | null;
  offset?: number | null;
}

// ============================================================================
// MUTATION INPUT TYPES
// ============================================================================

/**
 * Input for adding hotel booking to cart
 */
export interface AddToCartInput {
  /** Hotel ID to add to cart */
  hotelId: string;
  /** Number of nights (default: 1) */
  nights?: number | null;
}

/**
 * Input for updating booking nights
 */
export interface UpdateBookingInput {
  /** Booking ID to update */
  bookingId: string;
  /** New number of nights (minimum: 1) */
  nights: number;
}

/**
 * Input for removing booking from cart
 */
export interface RemoveBookingInput {
  /** Booking ID to remove */
  bookingId: string;
}

// ============================================================================
// RESOLVER RETURN TYPES
// ============================================================================

/**
 * Response type for hotel queries
 */
export interface HotelsResponse {
  hotels: HotelWithCategory[];
  total: number;
}

/**
 * Response type for booking cart queries
 */
export interface BookingCartResponse {
  items: BookingWithHotel[];
  total: number;
  subtotal: number;
}

/**
 * Response type for booking mutations
 */
export interface BookingMutationResponse {
  success: boolean;
  booking?: BookingWithHotel | null;
  message?: string | null;
}

// ============================================================================
// RESOLVER TYPE DEFINITIONS
// ============================================================================

/**
 * Query resolver function signatures
 */
export interface QueryResolvers {
  hotels: (
    parent: unknown,
    args: { input?: HotelQueryInput | null },
    context: GraphQLContext
  ) => Promise<HotelsResponse>;

  hotel: (
    parent: unknown,
    args: { id: string },
    context: GraphQLContext
  ) => Promise<HotelWithCategory | null>;

  categories: (
    parent: unknown,
    args: Record<string, never>,
    context: GraphQLContext
  ) => Promise<Category[]>;

  cart: (
    parent: unknown,
    args: Record<string, never>,
    context: GraphQLContext
  ) => Promise<BookingCartResponse>;
}

/**
 * Mutation resolver function signatures
 */
export interface MutationResolvers {
  addToCart: (
    parent: unknown,
    args: { input: AddToCartInput },
    context: GraphQLContext
  ) => Promise<BookingMutationResponse>;

  updateBooking: (
    parent: unknown,
    args: { input: UpdateBookingInput },
    context: GraphQLContext
  ) => Promise<BookingMutationResponse>;

  removeBooking: (
    parent: unknown,
    args: { input: RemoveBookingInput },
    context: GraphQLContext
  ) => Promise<BookingMutationResponse>;

  clearCart: (
    parent: unknown,
    args: Record<string, never>,
    context: GraphQLContext
  ) => Promise<BookingMutationResponse>;
}

/**
 * Complete resolver map with strict typing
 */
export interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
}
