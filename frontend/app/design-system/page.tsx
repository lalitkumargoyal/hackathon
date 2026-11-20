'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Select } from '@/components/atoms/Select';
import { ProductCard } from '@/components/molecules/ProductCard';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterPanel } from '@/components/molecules/FilterPanel';
import { CartItem } from '@/components/molecules/CartItem';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

/**
 * Design System Showcase Page
 * Demonstrates all atomic design components
 * Useful for development, testing, and documentation
 */
export default function DesignSystemPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={3} onSearch={() => undefined} />
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        <header className="mb-12">
          <h1 className="mb-2 text-text-primary">
            ProductSphere Design System
          </h1>
          <p className="text-lg text-text-secondary">
            WCAG AA Compliant Atomic Design Components
          </p>
        </header>

        {/* Atoms Section */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-border pb-3 text-text-primary">
            Atoms
          </h2>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Add to Cart</Button>
              <Button variant="secondary">View details</Button>
              <Button variant="primary" size="sm">Small Button</Button>
              <Button variant="primary" size="lg">Large Button</Button>
              <Button variant="primary" disabled>Disabled Button</Button>
              <Button variant="primary" isLoading>Loading Button</Button>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input label="Default Input" placeholder="Enter text..." />
              <Input label="With Helper" placeholder="Enter text..." helperText="This is helper text" />
              <Input label="With Error" placeholder="Enter text..." error="This field is required" />
              <Input placeholder="Disabled" disabled />
            </div>
          </div>

          {/* Badges */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="rating">
                <span className="flex items-center gap-1">
                  ★ 4.5
                </span>
              </Badge>
              <Badge variant="default" size="sm">Small Badge</Badge>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Checkboxes</h3>
            <div className="flex flex-col gap-3 max-w-xs">
              <Checkbox label="Default Checkbox" />
              <Checkbox label="Checked Checkbox" defaultChecked />
              <Checkbox label="Disabled Checkbox" disabled />
            </div>
          </div>

          {/* Select */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Select</h3>
            <div className="max-w-xs">
              <Select
                label="Sort By"
                options={[
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Rating' },
                  { value: 'name', label: 'Name' },
                ]}
                placeholder="Select option"
              />
            </div>
          </div>
        </section>

        {/* Molecules Section */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-border pb-3 text-text-primary">
            Molecules
          </h2>

          {/* Search Bar */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Search Bar</h3>
            <div className="max-w-xl">
              <SearchBar onSearch={(query) => setSearchQuery(query)} />
              {searchQuery && (
                <p className="text-sm text-text-secondary mt-2">Searching for: {searchQuery}</p>
              )}
            </div>
          </div>

          {/* Product Card */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Product Card</h3>
            <div className="max-w-sm">
              <ProductCard
                id="1"
                name="Premium Wireless Headphones"
                price={199.99}
                rating={4.8}
                imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                category="Electronics"
                onAddToCart={(id) => alert(`Added product ${id} to cart`)}
              />
            </div>
          </div>

          {/* Filter Panel */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Filter Panel</h3>
            <div className="max-w-sm">
              <FilterPanel
                title="Filters"
                options={[
                  { id: 'electronics', label: 'Electronics', count: 24 },
                  { id: 'mobile', label: 'Mobile Phones', count: 15 },
                  { id: 'laptops', label: 'Laptops', count: 12 },
                  { id: 'accessories', label: 'Accessories', count: 30 },
                ]}
                selectedIds={selectedFilters}
                onFilterChange={setSelectedFilters}
              />
            </div>
          </div>

          {/* Cart Item */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Cart Item</h3>
            <div className="max-w-2xl">
              <CartItem
                id="cart-1"
                productId="1"
                name="Premium Wireless Headphones"
                price={199.99}
                quantity={2}
                imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                onQuantityChange={(id, qty) => alert(`Update quantity to ${qty}`)}
                onRemove={(id) => alert(`Remove item ${id}`)}
              />
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-border pb-3 text-text-primary">
            Color Palette
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="mb-2 h-[72px] rounded-lg border border-border bg-background" />
              <p className="text-sm font-semibold">Background</p>
              <p className="text-sm text-text-secondary">#FFFFFF</p>
            </div>
            <div>
              <div className="mb-2 h-[72px] rounded-lg border border-border bg-surface" />
              <p className="text-sm font-semibold">Surface / Card</p>
              <p className="text-sm text-text-secondary">#F8FAFC</p>
            </div>
            <div>
              <div className="mb-2 h-[72px] rounded-lg border border-border bg-primary" />
              <p className="text-sm font-semibold">Primary / Action</p>
              <p className="text-sm text-text-secondary">#2563EB</p>
            </div>
            <div>
              <div className="mb-2 h-[72px] rounded-lg border border-border bg-text-primary" />
              <p className="text-sm font-semibold">Text / Primary</p>
              <p className="text-sm text-text-secondary">#1E293B</p>
            </div>
            <div>
              <div className="mb-2 h-[72px] rounded-lg border border-border bg-text-secondary" />
              <p className="text-sm font-semibold">Text / Secondary</p>
              <p className="text-sm text-text-secondary">#64748B</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="mb-6 border-b border-border pb-3 text-text-primary">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <h1>Find your next favorite.</h1>
              <p className="text-sm text-text-secondary">H1 · 32px / 48px · Semibold</p>
            </div>
            <div>
              <h2>Explore every category</h2>
              <p className="text-sm text-text-secondary">H2 · 24px / 36px · Semibold</p>
            </div>
            <div>
              <h3>Designed for everyday listening</h3>
              <p className="text-sm text-text-secondary">H3 · 20px / 30px · Semibold</p>
            </div>
            <div>
              <p>Compare products, check ratings, and choose with confidence.</p>
              <p className="text-sm text-text-secondary">Body · 16px / 24px · Regular</p>
            </div>
            <div>
              <p className="text-small">Small Text - 14px/1.5/400 - The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs">Extra Small - 12px/1.5/400 - The quick brown fox jumps over the lazy dog</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
