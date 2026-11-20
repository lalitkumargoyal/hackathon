# ProductSphere Backend - Commerce Data Structures

## Overview

This backend implements the ProductSphere commerce platform's data persistence layer using **Prisma ORM** with **PostgreSQL**. It provides the relational data models for catalog browsing and cart management.

## Technology Stack

- **Runtime:** Node.js v22+
- **ORM:** Prisma v5.22.0
- **Database:** PostgreSQL 16 (Alpine)
- **API Framework:** GraphQL Yoga v5.10.6 ✅ **CONFIGURED (SESUC-101)**
- **Language:** TypeScript v5.7+ with strict typing

---

## Database Schema (SESUC-9)

### Entity Relationship Diagram

```
Category (1) ──< (M) Product (1) ──< (M) CartItem
```

### Models

#### `Category`

Product taxonomy and navigation hierarchy.

| Column | Type | Constraints |
|-------------|----------|-----------------------------||
| `id` | String | PK, @default(cuid()) |
| `name` | String | Unique, Indexed |
| `slug` | String | Unique |
| `createdAt` | DateTime | @default(now()) |
| `updatedAt` | DateTime | @updatedAt |

**Relations:**

- `products` → One-to-Many with `Product`

#### `Product`

Product catalog entity.

| Column | Type | Constraints |
|---------------|----------|-----------------------------||
| `id` | String | PK, @default(cuid()) |
| `name` | String | |
| `description` | String | |
| `price` | Float | |
| `rating` | Float | |
| `imageUrl` | String | |
| `categoryId` | String | FK → Category(id), Indexed |
| `createdAt` | DateTime | @default(now()) |
| `updatedAt` | DateTime | @updatedAt |

**Relations:**

- `category` → Many-to-One with `Category`
- `cartItems` → One-to-Many with `CartItem`

#### `CartItem`

Shopping cart line item.

| Column | Type | Constraints |
|-------------|----------|-----------------------------||
| `id` | String | PK, @default(cuid()) |
| `quantity` | Int | @default(1) |
| `productId` | String | FK → Product(id), Indexed |
| `createdAt` | DateTime | @default(now()) |
| `updatedAt` | DateTime | @updatedAt |

**Relations:**

- `product` → Many-to-One with `Product`

---

## Setup & Configuration

### Prerequisites

- Node.js v22+
- Docker & Docker Compose (for local PostgreSQL)
- npm or yarn

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**`.env` Configuration:**

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/productsphere?schema=public"

# Server Configuration
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL container
docker-compose up -d

# Run migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

---

## Available Scripts

| Command                                 | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| `npm run dev`                           | Start development server (GraphQL Yoga)     |
| `npm run build`                         | Compile TypeScript to JavaScript            |
| `npm start`                             | Run production server                       |
| `npm run prisma:generate`               | Generate Prisma Client types                |
| `npm run prisma:migrate`                | Run database migrations                     |
| `npm run prisma:studio`                 | Open Prisma Studio (database GUI)           |
| `npm run db:seed`                       | Seed database with mock products (SESUC-10) |
| `ts-node src/test-product-discovery.ts` | Run product discovery tests (SESUC-102)     |

---

## Database Management

### Start/Stop PostgreSQL Container

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove volumes (CAUTION: Deletes all data)
docker-compose down -v
```

### Access Database

```bash
# Using Prisma Studio (GUI)
npm run prisma:studio

# Using psql CLI
docker exec -it productsphere-db psql -U postgres -d productsphere
```

### Migration History

```bash
# View applied migrations
ls -la prisma/migrations/

# Current migration: 20261015142310_init_commerce_schema
```

---

## Validation & Testing

### Schema Validation

✅ **Migration Applied Successfully:**

```
Applying migration `20261015142310_init_commerce_schema`
Your database is now in sync with your schema.
```

✅ **Tables Created:**

- `Category` (5 columns, 4 indexes, referenced by Product)
- `Product` (9 columns, 2 indexes, 2 foreign keys)
- `CartItem` (5 columns, 2 indexes, 1 foreign key)

✅ **Foreign Key Constraints:**

- `Product.categoryId` → `Category.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `CartItem.productId` → `Product.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)

✅ **Indexes:**

- `Category.name` (unique + indexed for fast search)
- `Category.slug` (unique for URL routing)
- `Product.categoryId` (indexed for join optimization)
- `CartItem.productId` (indexed for cart queries)

✅ **Prisma Client Generated:**

```
Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### Product Discovery API Testing (SESUC-102)

✅ **Implemented:** Comprehensive test suite for product discovery queries

**Run Tests:**

```bash
# Make sure database is running and seeded
docker-compose up -d
npm run db:seed

# Run product discovery tests
ts-node src/test-product-discovery.ts
```

**Test Coverage:**

- ✅ Products query with no filters
- ✅ Products query with category filter
- ✅ Products query with price range filter
- ✅ Products query with search filter
- ✅ Products query with sorting (price, rating, name)
- ✅ Products query with pagination
- ✅ Product by ID query (valid and invalid)
- ✅ Categories query
- ✅ Combined filters (category + price + sort)

**Expected Output:**

```
╔═══════════════════════════════════════════════════════╗
║  SESUC-102: Product Discovery Queries Test Suite     ║
╚═══════════════════════════════════════════════════════╝

✅ Products Query - No Filters
   Found 24 total products

✅ Products Query - Category Filter
   Found 5 products in category "mobile-phones"

✅ Products Query - Price Range Filter
   Found 18 products between $100-$1000

✅ Products Query - Search Filter
   Found 3 products matching "phone"

✅ Products Query - Sort by Price Ascending
   Verified 10 products sorted by price ascending

✅ Products Query - Sort by Rating Descending
   Verified 10 products sorted by rating descending

✅ Products Query - Pagination
   Page 1: 5 products, Page 2: 5 products

✅ Product Query - By ID
   Found product: "iPhone 15 Pro Max" (Mobile Phones)

✅ Product Query - Invalid ID (should return null)
   Correctly returned null for invalid ID

✅ Categories Query
   Found 5 categories: Accessories, Electronics, Laptops, ...

✅ Products Query - Combined Filters
   Found 3 products with combined filters

═══════════════════════════════════════════════════════

📊 Test Results: 11 passed, 0 failed

🎉 All tests passed! Product Discovery Queries are working correctly.
```

📖 **API Documentation:** See [PRODUCT_DISCOVERY_API.md](./PRODUCT_DISCOVERY_API.md)

---

## Seed Data (SESUC-10)

✅ **Implemented:** Product catalog seed script with 24 realistic products

### Quick Start

```bash
# Run seed script
npm run db:seed

# Or using Prisma CLI
npx prisma db seed
```

### What Gets Seeded

- **5 Categories:** Electronics, Mobile Phones, Accessories, Laptops, Smart Devices
- **24 Products:** Realistic product names, descriptions, prices ($49.99 - $3,499.99), ratings (4.3 - 4.9)
- **Placeholder Images:** Using placehold.co with brand colors

### Product Examples

| Category      | Sample Products                                                 |
| ------------- | --------------------------------------------------------------- |
| Mobile Phones | iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, Google Pixel 8 Pro |
| Laptops       | MacBook Pro M3 Max, Dell XPS 15, ThinkPad X1 Carbon             |
| Smart Devices | Apple Watch Series 9, Amazon Echo Show 15, Ring Doorbell Pro 2  |
| Accessories   | AirPods Pro, Sony WH-1000XM5, Logitech MX Master 3S             |
| Electronics   | Sony A7 IV, DJI Mini 4 Pro, Nintendo Switch OLED                |

⚠️ **Warning:** Seed script deletes all existing data before seeding!

📖 **Full Documentation:** See [SEED_DATA.md](./SEED_DATA.md) for detailed information.

---

## GraphQL Yoga Endpoint (SESUC-101)

✅ **Implemented:** Typed GraphQL Yoga endpoint for commerce API access

### Architecture

```
src/
├── index.ts         # GraphQL Yoga server entry point
├── schema.ts        # GraphQL type definitions
├── resolvers.ts     # Typed query/mutation resolvers
└── types.ts         # TypeScript type definitions
```

### Starting the Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

**Server Output:**

```
🚀 ProductSphere GraphQL API Server
═════════════════════════════════════════
📡 GraphQL endpoint: http://0.0.0.0:4000/graphql
🎮 GraphiQL IDE: http://localhost:4000/graphql
═════════════════════════════════════════
✅ Server ready with strict TypeScript typing
🔧 Environment: development
═════════════════════════════════════════
```

### GraphQL API Operations

#### Queries

**`products(input: ProductQueryInput): ProductsResponse!`**

- Filter by category, price range, search term
- Sort by price, rating, name
- Pagination with limit/offset

**`product(id: ID!): Product`**

- Get single product by ID with category

**`categories: [Category!]!`**

- Get all product categories

**`cart: CartResponse!`**

- Get cart items with totals

#### Mutations

**`addToCart(input: AddToCartInput!): CartMutationResponse!`**

- Add product to cart or increment quantity

**`updateCartItem(input: UpdateCartItemInput!): CartMutationResponse!`**

- Update cart item quantity

**`removeFromCart(input: RemoveFromCartInput!): CartMutationResponse!`**

- Remove item from cart

**`clearCart: CartMutationResponse!`**

- Clear all cart items

### Type Safety

All resolvers use strict TypeScript typing:

- ✅ **Context types** (`GraphQLContext` with Prisma client)
- ✅ **Input types** (filters, mutations with validation)
- ✅ **Response types** (products, cart, mutations)
- ✅ **Domain models** (Product, Category, CartItem with relations)

### GraphiQL IDE

Access interactive API explorer at `http://localhost:4000/graphql`

**Example Query:**

```graphql
query GetProducts {
  products(
    input: {
      filter: { category: "electronics", minPrice: 100, maxPrice: 1000 }
      sortBy: PRICE_ASC
      limit: 10
    }
  ) {
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
```

**Example Mutation:**

```graphql
mutation AddToCart {
  addToCart(input: { productId: "clxyz123", quantity: 2 }) {
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
```

---

## Out of Scope (Per SESUC-9)

🚫 **NOT Implemented:**

- Product discovery UI components
- Cart interaction workflows
- User authentication
- Payment processing

---

## Next Steps

1. ✅ **SESUC-10:** Seed PostgreSQL with 20+ mock products (COMPLETED)
2. ✅ **SESUC-101:** Configure GraphQL Yoga endpoint with strict TypeScript typing (COMPLETED)
3. **Next:** Integrate GraphQL API with Next.js 15 frontend via Apollo Client

---

## Troubleshooting

### Port 5432 Already in Use

**Solution:** The docker-compose configuration uses port `5433` to avoid conflicts.

### Migration Fails

```bash
# Reset database (CAUTION: Deletes all data)
docker-compose down -v
docker-compose up -d
sleep 5
npx prisma migrate dev --name init_commerce_schema
```

### Prisma Client Out of Sync

```bash
npx prisma generate
```

---

## License

MIT
