'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { FilterPanel } from '@/components/molecules/FilterPanel';
import { Select } from '@/components/atoms/Select';
import type { SortCriteria } from '@/types/types';

// Mock data for static UI
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    rating: 4.5,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Headphones',
    category: 'Electronics',
    categoryId: 'electronics',
    description: 'Premium wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker',
    price: 129.99,
    rating: 4.8,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Fitness+Tracker',
    category: 'Smart Devices',
    categoryId: 'smart',
    description: 'Track your health and fitness goals'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    price: 24.99,
    rating: 4.3,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=T-Shirt',
    category: 'Accessories',
    categoryId: 'accessories',
    description: 'Comfortable organic cotton t-shirt'
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    price: 34.99,
    rating: 4.6,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Water+Bottle',
    category: 'Accessories',
    categoryId: 'accessories',
    description: 'Insulated water bottle keeps drinks cold for 24 hours'
  },
  {
    id: '5',
    name: 'Leather Laptop Bag',
    price: 89.99,
    rating: 4.7,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Laptop+Bag',
    category: 'Accessories',
    categoryId: 'accessories',
    description: 'Premium leather laptop bag with multiple compartments'
  },
  {
    id: '6',
    name: 'Yoga Mat Pro',
    price: 49.99,
    rating: 4.4,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Yoga+Mat',
    category: 'Smart Devices',
    categoryId: 'smart',
    description: 'Non-slip yoga mat with extra cushioning'
  },
  {
    id: '7',
    name: 'Ceramic Coffee Mug Set',
    price: 29.99,
    rating: 4.2,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Coffee+Mug',
    category: 'Accessories',
    categoryId: 'accessories',
    description: 'Set of 4 handcrafted ceramic mugs'
  },
  {
    id: '8',
    name: 'Portable Phone Charger',
    price: 39.99,
    rating: 4.5,
    imageUrl: 'https://placehold.co/400x400/e2e8f0/64748b?text=Charger',
    category: 'Electronics',
    categoryId: 'electronics',
    description: '10000mAh portable power bank'
  },
];

const MOCK_CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'mobile', name: 'Mobile Phones' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'smart', name: 'Smart Devices' },
];

/**
 * Products Page - Main product discovery interface
 * Features: Search, filter by category, sort, and responsive grid
 * WCAG AA compliant with keyboard navigation and screen reader support
 */
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortCriteria>('rating');
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Handle search with debouncing logic (300ms)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortCriteria);
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback((productId: string) => {
    setCartItemsCount((prev) => prev + 1);
    // In real implementation, this would dispatch to Zustand store
    console.log('Added product to cart:', productId);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = MOCK_PRODUCTS;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted;
  }, [searchQuery, selectedCategories, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemsCount} onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        <div className="mb-8">
          <h1>All Products</h1>
          <p className="text-base text-text-secondary">
            Everyday technology. Thoughtfully selected.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-80">
            <FilterPanel
              title="Filters"
              sectionLabel="Categories"
              description="Choose categories to narrow your results."
              options={MOCK_CATEGORIES.map((category) => ({
                id: category.id,
                label: category.name,
              }))}
              selectedIds={selectedCategories}
              onFilterChange={setSelectedCategories}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="pb-1 text-base text-text-secondary">
                {filteredAndSortedProducts.length}{' '}
                {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
              </p>
              <div className="w-full sm:w-[282px]">
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: 'price-asc', label: 'Price (Low-High)' },
                    { value: 'price-desc', label: 'Price (High-Low)' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'name', label: 'Alphabetical' },
                  ]}
                />
              </div>
            </div>

            <ProductGrid
              products={filteredAndSortedProducts}
              onAddToCart={handleAddToCart}
              isLoading={false}
            />
            <p className="mt-6 text-center text-sm text-text-secondary">
              Showing all {filteredAndSortedProducts.length} products
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
