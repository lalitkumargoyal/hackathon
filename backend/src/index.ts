/**
 * ProductSphere GraphQL Yoga Server
 * Typed GraphQL endpoint for commerce API operations
 */

import { createYoga, createSchema } from 'graphql-yoga';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import type { GraphQLContext } from './types';

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

/**
 * Initialize Prisma Client with optimized configuration
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Graceful shutdown handler for database connections
 */
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// ============================================================================
// GRAPHQL YOGA SERVER CONFIGURATION
// ============================================================================

/**
 * Create GraphQL Schema with strict typing
 */
const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers: resolvers as any,
});

/**
 * Create GraphQL Yoga instance with strict typing
 */
const yoga = createYoga<GraphQLContext>({
  schema,
  context: async (): Promise<GraphQLContext> => ({
    prisma,
  }),
  graphiql: {
    title: 'ProductSphere Commerce API',
    defaultQuery: `# Welcome to ProductSphere GraphQL API
# 🛒 Commerce operations with strict TypeScript typing

# Example: Query products with filters
query GetProducts {
  products(input: {
    filter: {
      category: "electronics"
      minPrice: 100
      maxPrice: 1000
    }
    sortBy: PRICE_ASC
    limit: 10
  }) {
    total
    products {
      id
      name
      price
      rating
      category {
        name
        slug
      }
    }
  }
}

# Example: Query single product
query GetProduct {
  product(id: "product-id-here") {
    id
    name
    description
    price
    rating
    imageUrl
    category {
      name
      slug
    }
  }
}

# Example: Get all categories
query GetCategories {
  categories {
    id
    name
    slug
  }
}

# Example: Get cart contents
query GetCart {
  cart {
    total
    subtotal
    items {
      id
      quantity
      product {
        id
        name
        price
        imageUrl
      }
    }
  }
}

# Example: Add product to cart
mutation AddToCart {
  addToCart(input: {
    productId: "product-id-here"
    quantity: 2
  }) {
    success
    message
    cartItem {
      id
      quantity
      product {
        name
        price
      }
    }
  }
}

# Example: Update cart item quantity
mutation UpdateCartItem {
  updateCartItem(input: {
    cartItemId: "cart-item-id-here"
    quantity: 5
  }) {
    success
    message
    cartItem {
      id
      quantity
    }
  }
}

# Example: Remove from cart
mutation RemoveFromCart {
  removeFromCart(input: {
    cartItemId: "cart-item-id-here"
  }) {
    success
    message
  }
}

# Example: Clear entire cart
mutation ClearCart {
  clearCart {
    success
    message
  }
}`,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  landingPage: false,
});

// ============================================================================
// HTTP SERVER INITIALIZATION
// ============================================================================

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Create and start HTTP server
 */
const server = createServer(yoga);

server.listen(PORT, HOST, () => {
  console.log('🚀 ProductSphere GraphQL API Server');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 GraphQL endpoint: http://${HOST}:${PORT}/graphql`);
  console.log(`🎮 GraphiQL IDE: http://localhost:${PORT}/graphql`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Server ready with strict TypeScript typing');
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

/**
 * Error handler for uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
