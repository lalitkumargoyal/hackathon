'use client';

import React, { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import Link from 'next/link';

// Mock product data for static UI
const MOCK_PRODUCTS = {
  '1': {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    rating: 4.5,
    imageUrl: 'https://placehold.co/600x600/e2e8f0/64748b?text=Headphones',
    category: 'Electronics',
    categoryId: 'cat-1',
    description: 'Experience superior sound quality with our premium wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design perfect for long listening sessions.',
    features: [
      'Active Noise Cancellation (ANC)',
      '30-hour battery life',
      'Bluetooth 5.0 connectivity',
      'Foldable design with carrying case',
      'Built-in microphone for calls',
      'Quick charge: 10 min = 5 hours playback'
    ],
    specifications: {
      'Brand': 'AudioPro',
      'Model': 'AP-WH1000',
      'Color': 'Midnight Black',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0, 3.5mm Jack',
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Warranty': '2 years'
    },
    images: [
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+1',
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+2',
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+3',
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+4'
    ]
  },
  '2': {
    id: '2',
    name: 'Smart Fitness Tracker',
    price: 129.99,
    rating: 4.8,
    imageUrl: 'https://placehold.co/600x600/e2e8f0/64748b?text=Fitness+Tracker',
    category: 'Electronics',
    categoryId: 'cat-1',
    description: 'Track your health and fitness goals with precision. Monitor heart rate, steps, sleep quality, and more with our advanced smart fitness tracker.',
    features: [
      '24/7 heart rate monitoring',
      'Sleep tracking and analysis',
      'Step counter and calorie tracker',
      'Water resistant (5ATM)',
      '7-day battery life',
      'Compatible with iOS and Android'
    ],
    specifications: {
      'Brand': 'FitLife',
      'Model': 'FL-ST2000',
      'Display': '1.4" AMOLED',
      'Battery': '7 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart rate, Accelerometer, Gyroscope',
      'Connectivity': 'Bluetooth 5.0',
      'Warranty': '1 year'
    },
    images: [
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+1',
      'https://placehold.co/600x600/e2e8f0/64748b?text=View+2'
    ]
  }
};

/**
 * Product Detail Page - Comprehensive product information
 * Features: Image gallery, detailed specs, add to cart
 * Dynamic route: /products/[id]
 * WCAG AA compliant with proper heading hierarchy and accessible images
 */
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Get product data (in real app, this would be fetched via GraphQL)
  const product = MOCK_PRODUCTS[productId as keyof typeof MOCK_PRODUCTS];
  const handleSearch = useCallback((query: string) => {
    if (query) router.push(`/products?q=${encodeURIComponent(query)}`);
  }, [router]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      setCartItemsCount((prev) => prev + quantity);
      setIsAddingToCart(false);
      // In real implementation, this would dispatch to Zustand store
      console.log(`Added ${quantity} of product ${productId} to cart`);
    }, 500);
  }, [productId, quantity]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  }, []);

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItemsCount} onSearch={handleSearch} />
        <main className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-10">
          <div className="text-center">
            <h1 className="mb-4">Product Not Found</h1>
            <p className="mb-8 text-text-secondary">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const images = product.images || [product.imageUrl];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemsCount} onSearch={handleSearch} />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 lg:px-10">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link
                href="/products"
                className="rounded text-primary"
              >
                Products
              </Link>
            </li>
            <li>
              <svg className="h-4 w-4 text-text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li className="text-text-secondary" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="mb-4 overflow-hidden rounded-lg border border-border bg-surface">
              <img
                src={images[selectedImage]}
                alt={`${product.name} - View ${selectedImage + 1}`}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded border-2 bg-surface ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-border'
                    }`}
                    aria-label={`View image ${index + 1} of ${product.name}`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div>
            {/* Category Badge */}
            <div className="mb-3">
              <Badge variant="default" size="sm">
                {product.category}
              </Badge>
            </div>

            {/* Product Name */}
            <h1 className="mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="rating" size="md">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-rating"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {product.rating.toFixed(1)}
                </span>
              </Badge>
              <span className="text-sm text-text-secondary">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-2xl font-semibold text-text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-base leading-normal text-text-primary">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="mb-2 block text-base font-semibold text-text-primary">
                Quantity
              </label>
              <div className="flex w-fit items-center overflow-hidden rounded border border-text-secondary">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="flex size-12 items-center justify-center bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="h-12 w-12 border-x border-border bg-background text-center text-base font-semibold text-text-primary"
                  aria-label="Product quantity"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 99}
                  className="flex size-12 items-center justify-center bg-background disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-8">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                isLoading={isAddingToCart}
                aria-label={`Add ${quantity} ${product.name} to cart`}
              >
                Add to Cart
              </Button>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="mb-4">Key Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-text-primary">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h2 className="mb-4">Specifications</h2>
              <dl className="grid grid-cols-1 gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-border pb-3">
                    <dt className="w-1/3 font-semibold text-text-primary">{key}</dt>
                    <dd className="w-2/3 text-text-secondary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
