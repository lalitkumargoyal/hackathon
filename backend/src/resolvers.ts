/**
 * GraphQL Resolvers with Strict TypeScript Typing
 * Implements Query and Mutation operations for HotelSphere (Marriott International) API
 */

import type {
  Resolvers,
  HotelQueryInput,
  HotelsResponse,
  BookingCartResponse,
  BookingMutationResponse,
  HotelWithCategory,
  BookingWithHotel,
  HotelSortOption,
} from "./types";
import { Prisma } from "@prisma/client";

/**
 * Build Prisma where clause from hotel filter input
 */
function buildHotelWhereClause(
  filter?: HotelQueryInput["filter"],
): Prisma.HotelWhereInput {
  if (!filter) return {};

  const where: Prisma.HotelWhereInput = {};

  // Category filter (Marriott brand)
  if (filter.category) {
    where.category = {
      slug: filter.category,
    };
  }

  // Price range filters (nightly rate)
  if (filter.minPrice !== undefined && filter.minPrice !== null) {
    where.price = { ...(where.price as object), gte: filter.minPrice };
  }
  if (filter.maxPrice !== undefined && filter.maxPrice !== null) {
    where.price = { ...(where.price as object), lte: filter.maxPrice };
  }

  // Search filter - search both name and location
  if (filter.search) {
    where.OR = [
      {
        name: {
          contains: filter.search,
        },
      },
      {
        location: {
          contains: filter.search,
        },
      },
    ];
  }

  return where;
}

/**
 * Build Prisma orderBy clause from sort option
 */
function buildHotelOrderByClause(
  sortBy?: HotelSortOption | null,
): Prisma.HotelOrderByWithRelationInput {
  if (!sortBy) return { createdAt: "desc" }; // Default sort

  switch (sortBy) {
    case "PRICE_ASC":
      return { price: "asc" };
    case "PRICE_DESC":
      return { price: "desc" };
    case "RATING_DESC":
      return { rating: "desc" };
    case "NAME_ASC":
      return { name: "asc" };
    default:
      return { createdAt: "desc" };
  }
}

/**
 * Calculate booking cart subtotal from items
 */
function calculateCartSubtotal(items: BookingWithHotel[]): number {
  return items.reduce((sum, item) => sum + item.hotel.price * item.nights, 0);
}

/**
 * Query Resolvers - Hotel Discovery and Booking Cart Retrieval
 */
const Query: Resolvers["Query"] = {
  /**
   * Retrieve hotels with filtering, sorting, and pagination
   */
  hotels: async (_parent, { input }, { prisma }): Promise<HotelsResponse> => {
    const where = buildHotelWhereClause(input?.filter);
    const orderBy = buildHotelOrderByClause(input?.sortBy);
    const limit =
      input?.limit !== null && input?.limit !== undefined ? input.limit : 50; // Default limit
    const offset =
      input?.offset !== null && input?.offset !== undefined ? input.offset : 0;

    // Execute query with count in parallel for performance
    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          category: true,
        },
      }),
      prisma.hotel.count({ where }),
    ]);

    return {
      hotels: hotels as HotelWithCategory[],
      total,
    };
  },

  /**
   * Retrieve single hotel by ID
   */
  hotel: async (
    _parent,
    { id },
    { prisma },
  ): Promise<HotelWithCategory | null> => {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    return hotel as HotelWithCategory | null;
  },

  /**
   * Retrieve all Marriott brand categories
   */
  categories: async (_parent, _args, { prisma }) => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  /**
   * Retrieve current booking cart
   */
  cart: async (_parent, _args, { prisma }): Promise<BookingCartResponse> => {
    const items = await prisma.booking.findMany({
      include: {
        hotel: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const typedItems = items as BookingWithHotel[];

    return {
      items: typedItems,
      total: items.reduce((sum, item) => sum + item.nights, 0),
      subtotal: calculateCartSubtotal(typedItems),
    };
  },
};

/**
 * Mutation Resolvers - Booking Cart Management Operations
 */
const Mutation: Resolvers["Mutation"] = {
  /**
   * Add hotel to booking cart or increment nights if exists
   */
  addToCart: async (
    _parent,
    { input },
    { prisma },
  ): Promise<BookingMutationResponse> => {
    const { hotelId, nights: inputNights } = input;
    const nights = inputNights ?? 1;

    // Validate hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return {
        success: false,
        message: `Hotel with ID ${hotelId} not found`,
      };
    }

    // Validate nights
    if (nights < 1) {
      return {
        success: false,
        message: "Number of nights must be at least 1",
      };
    }

    // Check if hotel already in booking cart
    const existingBooking = await prisma.booking.findFirst({
      where: { hotelId },
    });

    let booking: BookingWithHotel;

    if (existingBooking) {
      // Increment existing booking nights
      const updated = await prisma.booking.update({
        where: { id: existingBooking.id },
        data: { nights: existingBooking.nights + nights },
        include: {
          hotel: {
            include: { category: true },
          },
        },
      });
      booking = updated as BookingWithHotel;
    } else {
      // Create new booking
      const created = await prisma.booking.create({
        data: {
          hotelId,
          nights,
        },
        include: {
          hotel: {
            include: { category: true },
          },
        },
      });
      booking = created as BookingWithHotel;
    }

    return {
      success: true,
      booking,
      message: `Added ${nights} night(s) at ${hotel.name} to cart`,
    };
  },

  /**
   * Update booking nights
   */
  updateBooking: async (
    _parent,
    { input },
    { prisma },
  ): Promise<BookingMutationResponse> => {
    const { bookingId, nights } = input;

    // Validate nights
    if (nights < 1) {
      return {
        success: false,
        message: "Number of nights must be at least 1",
      };
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
      },
    });

    if (!existingBooking) {
      return {
        success: false,
        message: `Booking with ID ${bookingId} not found`,
      };
    }

    // Update nights
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { nights },
      include: {
        hotel: {
          include: { category: true },
        },
      },
    });

    return {
      success: true,
      booking: updated as BookingWithHotel,
      message: `Updated ${existingBooking.hotel.name} booking to ${nights} night(s)`,
    };
  },

  /**
   * Remove booking from cart
   */
  removeBooking: async (
    _parent,
    { input },
    { prisma },
  ): Promise<BookingMutationResponse> => {
    const { bookingId } = input;

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
      },
    });

    if (!existingBooking) {
      return {
        success: false,
        message: `Booking with ID ${bookingId} not found`,
      };
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return {
      success: true,
      message: `Removed ${existingBooking.hotel.name} from cart`,
    };
  },

  /**
   * Clear all bookings from cart
   */
  clearCart: async (
    _parent,
    _args,
    { prisma },
  ): Promise<BookingMutationResponse> => {
    const result = await prisma.booking.deleteMany({});

    return {
      success: true,
      message: `Cleared ${result.count} booking(s) from cart`,
    };
  },
};

/**
 * Export complete typed resolver map
 */
export const resolvers: Resolvers = {
  Query,
  Mutation,
};
