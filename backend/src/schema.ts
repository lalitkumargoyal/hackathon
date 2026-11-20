/**
 * GraphQL Schema Definition for HotelSphere (Marriott International) API
 * Schema-first approach with strict type definitions
 */

export const typeDefs = /* GraphQL */ `
  """
  Hotel brand taxonomy (Marriott brands)
  """
  type Category {
    "Unique category identifier"
    id: ID!
    "Brand display name"
    name: String!
    "URL-friendly brand slug"
    slug: String!
    "Timestamp of category creation"
    createdAt: String!
    "Timestamp of last category update"
    updatedAt: String!
  }

  """
  Hotel property entity with details
  """
  type Hotel {
    "Unique hotel identifier"
    id: ID!
    "Hotel property name"
    name: String!
    "Detailed hotel description"
    description: String!
    "Nightly rate in USD"
    price: Float!
    "Average guest rating (0-5)"
    rating: Float!
    "Hotel image URL"
    imageUrl: String!
    "Hotel location (city, state/country)"
    location: String!
    "Associated Marriott brand"
    category: Category!
    "Timestamp of hotel creation"
    createdAt: String!
    "Timestamp of last hotel update"
    updatedAt: String!
  }

  """
  Hotel booking line item
  """
  type Booking {
    "Unique booking identifier"
    id: ID!
    "Hotel associated with this booking"
    hotel: Hotel!
    "Number of nights"
    nights: Int!
    "Timestamp of booking creation"
    createdAt: String!
    "Timestamp of last booking update"
    updatedAt: String!
  }

  """
  Filter criteria for hotel discovery
  """
  input HotelFilterInput {
    "Filter by Marriott brand slug"
    category: String
    "Minimum nightly rate threshold (inclusive)"
    minPrice: Float
    "Maximum nightly rate threshold (inclusive)"
    maxPrice: Float
    "Search term for hotel name or location (case-insensitive)"
    search: String
  }

  """
  Hotel sorting options
  """
  enum HotelSortOption {
    "Sort by price ascending"
    PRICE_ASC
    "Sort by price descending"
    PRICE_DESC
    "Sort by rating descending (highest first)"
    RATING_DESC
    "Sort by name alphabetically ascending"
    NAME_ASC
  }

  """
  Complete hotel query parameters
  """
  input HotelQueryInput {
    "Filter criteria for hotels"
    filter: HotelFilterInput
    "Sorting option for results"
    sortBy: HotelSortOption
    "Maximum number of results to return"
    limit: Int
    "Number of results to skip (for pagination)"
    offset: Int
  }

  """
  Response type for hotel queries
  """
  type HotelsResponse {
    "List of hotels matching query criteria"
    hotels: [Hotel!]!
    "Total count of hotels matching filters (before pagination)"
    total: Int!
  }

  """
  Booking cart summary with items and totals
  """
  type BookingCartResponse {
    "List of bookings in the cart"
    items: [Booking!]!
    "Total number of nights across all bookings"
    total: Int!
    "Cart subtotal (sum of all hotel rates * nights)"
    subtotal: Float!
  }

  """
  Input for adding hotel to booking cart
  """
  input AddToCartInput {
    "Hotel ID to add to cart"
    hotelId: ID!
    "Number of nights (default: 1, minimum: 1)"
    nights: Int
  }

  """
  Input for updating booking nights
  """
  input UpdateBookingInput {
    "Booking ID to update"
    bookingId: ID!
    "New number of nights (minimum: 1)"
    nights: Int!
  }

  """
  Input for removing booking from cart
  """
  input RemoveBookingInput {
    "Booking ID to remove"
    bookingId: ID!
  }

  """
  Response type for booking mutations
  """
  type BookingMutationResponse {
    "Operation success status"
    success: Boolean!
    "Updated or created booking (if applicable)"
    booking: Booking
    "Human-readable operation result message"
    message: String
  }

  """
  Root query type - Hotel discovery and booking retrieval operations
  """
  type Query {
    """
    Retrieve hotels with optional filtering, sorting, and pagination
    Returns empty list if no hotels match criteria
    """
    hotels(input: HotelQueryInput): HotelsResponse!

    """
    Retrieve single hotel by ID
    Returns null if hotel not found
    """
    hotel(id: ID!): Hotel

    """
    Retrieve all available Marriott brand categories
    Returns empty list if no categories exist
    """
    categories: [Category!]!

    """
    Retrieve current booking cart contents
    Returns empty cart if no bookings exist
    """
    cart: BookingCartResponse!
  }

  """
  Root mutation type - Booking cart management operations
  """
  type Mutation {
    """
    Add hotel to booking cart or increment nights if already exists
    Creates new booking or updates existing one
    """
    addToCart(input: AddToCartInput!): BookingMutationResponse!

    """
    Update number of nights for existing booking
    Fails if booking ID not found or nights < 1
    """
    updateBooking(input: UpdateBookingInput!): BookingMutationResponse!

    """
    Remove booking from cart by booking ID
    Fails if booking ID not found
    """
    removeBooking(input: RemoveBookingInput!): BookingMutationResponse!

    """
    Remove all bookings from cart
    Always succeeds even if cart is already empty
    """
    clearCart: BookingMutationResponse!
  }
`;
