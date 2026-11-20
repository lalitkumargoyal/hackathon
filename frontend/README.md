# ProductSphere Frontend

## Overview

ProductSphere is a high-performance, WCAG AA compliant product discovery application built with Next.js 15, React 19, and an atomic design system.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom WCAG AA design tokens
- **State Management**: Zustand (Cart and Filter stores)
- **API Client**: Apollo Client (GraphQL)
- **Design Pattern**: Atomic Design System

## Project Structure

```
frontend/
├── app/                       # Next.js App Router
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   └── providers/             # Client-side providers
│       └── ApolloWrapper.tsx  # Apollo Client provider
├── components/                # Atomic Design System
│   ├── atoms/                 # Basic building blocks
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Select.tsx
│   │   └── index.ts
│   ├── molecules/             # Composite components
│   │   ├── ProductCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── CartItem.tsx
│   │   └── index.ts
│   └── organisms/             # Complex components
│       ├── Header.tsx
│       ├── ProductGrid.tsx
│       ├── CartSummary.tsx
│       └── index.ts
├── store/                     # Zustand state management
│   ├── cartStore.ts           # Shopping cart state
│   └── filterStore.ts         # Product filters state
├── lib/                       # Utilities and clients
│   └── apollo-client.ts       # Apollo Client configuration
├── tailwind.config.ts         # Tailwind with design tokens
└── package.json
```

## Atomic Design System

### Atoms

Basic UI building blocks:

- **Button**: Primary, secondary, and outline variants with loading states
- **Input**: Text input with labels, icons, and error states
- **Badge**: Status indicators and category tags
- **Checkbox**: Accessible checkboxes for filtering
- **Select**: Dropdown for sorting options

### Molecules

Composite components combining atoms:

- **ProductCard**: Product display with image, name, price, rating, and CTA
- **SearchBar**: Search input with debounce (300ms)
- **FilterPanel**: Collapsible filter panel with checkboxes
- **CartItem**: Cart item with quantity controls

### Organisms

Complex components combining molecules:

- **Header**: Navigation with logo, search, and cart
- **ProductGrid**: Responsive product grid with loading/empty states
- **CartSummary**: Order summary with totals and checkout CTA

## Design Tokens (WCAG AA Compliant)

### Colors

- **Background**: `#FFFFFF`
- **Surface**: `#F8FAFC` (Light Slate)
- **Primary**: `#2563EB` (Blue 600) - 4.5:1 contrast
- **Text Primary**: `#1E293B` (Slate 800)
- **Text Secondary**: `#64748B` (Slate 500)
- **Focus Ring**: `#2563EB` with 2px offset

### Typography

- **Font Family**: Inter (Google Fonts)
- **Base Size**: 16px
- **Scale**: H1 (32px), H2 (24px), H3 (20px)
- **Line Height**: 1.5x for body, 1.2-1.4x for headings

### Layout

- **Desktop Grid**: 12 columns, 24px gutters, 40px margins
- **Mobile Grid**: 4 columns, 16px gutters, 16px margins
- **Product Grid**: Auto-fill with 280px minimum

## Accessibility Features

✅ **WCAG AA Compliant**

- 4.5:1 contrast ratio for normal text
- 3:1 contrast ratio for large text and UI components
- Visible focus rings on all interactive elements
- Proper ARIA labels and live regions
- Keyboard navigation support
- Reduced motion support
- Semantic HTML structure

## State Management

### Cart Store (Zustand)

- Add/remove items
- Update quantities
- Calculate totals
- Persist to localStorage

### Filter Store (Zustand)

- Search query
- Category selection
- Sort criteria
- Clear filters

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your GraphQL endpoint
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
```

### Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Environment Variables

```env
NEXT_PUBLIC_GRAPHQL_URI=http://localhost:4000/graphql
NEXT_PUBLIC_APP_NAME=ProductSphere
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Component Usage Examples

### Button

```tsx
import { Button } from "@/components/atoms";

<Button variant="primary" size="md" onClick={handleClick}>
  Add to Cart
</Button>;
```

### ProductCard

```tsx
import { ProductCard } from "@/components/molecules";

<ProductCard
  id="1"
  name="Product Name"
  price={99.99}
  rating={4.5}
  imageUrl="/image.jpg"
  category="Electronics"
  onAddToCart={handleAddToCart}
/>;
```

### Using Cart Store

```tsx
import { useCartStore } from "@/store/cartStore";

const { items, addItem, getTotalItems } = useCartStore();
const cartCount = getTotalItems();
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

- Image lazy loading
- Component code splitting
- Apollo Client caching
- Debounced search (300ms)
- Optimistic UI updates

## Contributing

Please refer to the main project CONTRIBUTING.md for guidelines.

## License

MIT License - See LICENSE file for details
