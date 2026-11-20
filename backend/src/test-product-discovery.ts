/**
 * Product Discovery Queries Test Suite
 * Validates SESUC-102: Expose Product Discovery Queries for Catalog Retrieval
 * 
 * Tests cover:
 * - products query with filtering, sorting, and pagination
 * - product(id) query for single product retrieval
 * - categories query for catalog taxonomy
 */

import { PrismaClient } from '@prisma/client';
import type { GraphQLContext, ProductQueryInput, ProductSortOption } from './types';
import { resolvers } from './resolvers';

// ============================================================================
// TEST SETUP
// ============================================================================

const prisma = new PrismaClient();

const context: GraphQLContext = {
  prisma,
};

const parent = {};

// ============================================================================
// TEST UTILITIES
// ============================================================================

function logTestResult(testName: string, passed: boolean, details?: string) {
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${testName}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ============================================================================
// TEST: Products Query - All Products (No Filters)
// ============================================================================

async function testProductsQueryNoFilters() {
  const testName = 'Products Query - No Filters';
  try {
    const result = await resolvers.Query.products(parent, { input: null }, context);

    assert(Array.isArray(result.products), 'products should be an array');
    assert(typeof result.total === 'number', 'total should be a number');
    assert(result.total >= 0, 'total should be non-negative');
    assert(result.products.length <= result.total, 'products length should not exceed total');

    // Validate each product has required fields and category
    if (result.products.length > 0) {
      const product = result.products[0];
      assert(typeof product.id === 'string', 'product.id should be string');
      assert(typeof product.name === 'string', 'product.name should be string');
      assert(typeof product.price === 'number', 'product.price should be number');
      assert(typeof product.rating === 'number', 'product.rating should be number');
      assert(product.category !== undefined, 'product.category should be populated');
      assert(typeof product.category.name === 'string', 'category.name should be string');
      assert(typeof product.category.slug === 'string', 'category.slug should be string');
    }

    logTestResult(testName, true, `Found ${result.total} total products`);
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Category Filter
// ============================================================================

async function testProductsQueryCategoryFilter() {
  const testName = 'Products Query - Category Filter';
  try {
    // First, get a category slug to test with
    const categories = await resolvers.Query.categories(parent, {}, context);
    if (categories.length === 0) {
      logTestResult(testName, true, 'Skipped - no categories available');
      return;
    }

    const testCategorySlug = categories[0].slug;

    const input: ProductQueryInput = {
      filter: {
        category: testCategorySlug,
      },
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');
    
    // Validate all products belong to the specified category
    result.products.forEach(product => {
      assert(
        product.category.slug === testCategorySlug,
        `product category should match filter: expected ${testCategorySlug}, got ${product.category.slug}`
      );
    });

    logTestResult(
      testName,
      true,
      `Found ${result.total} products in category "${testCategorySlug}"`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Price Range Filter
// ============================================================================

async function testProductsQueryPriceFilter() {
  const testName = 'Products Query - Price Range Filter';
  try {
    const minPrice = 100;
    const maxPrice = 1000;

    const input: ProductQueryInput = {
      filter: {
        minPrice,
        maxPrice,
      },
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');

    // Validate all products are within price range
    result.products.forEach(product => {
      assert(
        product.price >= minPrice && product.price <= maxPrice,
        `product price should be in range: ${product.price} not between ${minPrice}-${maxPrice}`
      );
    });

    logTestResult(
      testName,
      true,
      `Found ${result.total} products between $${minPrice}-$${maxPrice}`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Search Filter
// ============================================================================

async function testProductsQuerySearchFilter() {
  const testName = 'Products Query - Search Filter';
  try {
    const searchTerm = 'phone'; // Common term in product names

    const input: ProductQueryInput = {
      filter: {
        search: searchTerm,
      },
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');

    // Validate all products contain search term (case-insensitive)
    result.products.forEach(product => {
      assert(
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        `product name should contain "${searchTerm}": ${product.name}`
      );
    });

    logTestResult(
      testName,
      true,
      `Found ${result.total} products matching "${searchTerm}"`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Sorting (Price Ascending)
// ============================================================================

async function testProductsQuerySortPriceAsc() {
  const testName = 'Products Query - Sort by Price Ascending';
  try {
    const input: ProductQueryInput = {
      sortBy: 'PRICE_ASC' as ProductSortOption,
      limit: 10,
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');

    // Validate products are sorted by price ascending
    for (let i = 1; i < result.products.length; i++) {
      assert(
        result.products[i - 1].price <= result.products[i].price,
        `products should be sorted by price ascending`
      );
    }

    logTestResult(
      testName,
      true,
      `Verified ${result.products.length} products sorted by price ascending`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Sorting (Rating Descending)
// ============================================================================

async function testProductsQuerySortRatingDesc() {
  const testName = 'Products Query - Sort by Rating Descending';
  try {
    const input: ProductQueryInput = {
      sortBy: 'RATING_DESC' as ProductSortOption,
      limit: 10,
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');

    // Validate products are sorted by rating descending
    for (let i = 1; i < result.products.length; i++) {
      assert(
        result.products[i - 1].rating >= result.products[i].rating,
        `products should be sorted by rating descending`
      );
    }

    logTestResult(
      testName,
      true,
      `Verified ${result.products.length} products sorted by rating descending`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Products Query - Pagination
// ============================================================================

async function testProductsQueryPagination() {
  const testName = 'Products Query - Pagination';
  try {
    const limit = 5;
    const offset = 0;

    const firstPageInput: ProductQueryInput = {
      limit,
      offset,
    };

    const firstPage = await resolvers.Query.products(parent, { input: firstPageInput }, context);

    assert(firstPage.products.length <= limit, 'first page should respect limit');

    // Get second page
    const secondPageInput: ProductQueryInput = {
      limit,
      offset: limit,
    };

    const secondPage = await resolvers.Query.products(parent, { input: secondPageInput }, context);

    // Verify pages don't overlap
    if (firstPage.products.length > 0 && secondPage.products.length > 0) {
      const firstPageIds = new Set(firstPage.products.map(p => p.id));
      const secondPageIds = secondPage.products.map(p => p.id);
      
      secondPageIds.forEach(id => {
        assert(
          !firstPageIds.has(id),
          `product ID ${id} should not appear in both pages`
        );
      });
    }

    logTestResult(
      testName,
      true,
      `Page 1: ${firstPage.products.length} products, Page 2: ${secondPage.products.length} products`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Product Query - Single Product by ID
// ============================================================================

async function testProductQueryById() {
  const testName = 'Product Query - By ID';
  try {
    // First get a product ID to test with
    const allProducts = await resolvers.Query.products(parent, { input: null }, context);
    
    if (allProducts.products.length === 0) {
      logTestResult(testName, true, 'Skipped - no products available');
      return;
    }

    const testProductId = allProducts.products[0].id;

    const product = await resolvers.Query.product(parent, { id: testProductId }, context);

    assert(product !== null, 'product should not be null');
    assert(product!.id === testProductId, `product ID should match: ${testProductId}`);
    assert(typeof product!.name === 'string', 'product.name should be string');
    assert(typeof product!.description === 'string', 'product.description should be string');
    assert(typeof product!.price === 'number', 'product.price should be number');
    assert(typeof product!.rating === 'number', 'product.rating should be number');
    assert(typeof product!.imageUrl === 'string', 'product.imageUrl should be string');
    assert(product!.category !== undefined, 'product.category should be populated');

    logTestResult(
      testName,
      true,
      `Found product: "${product!.name}" (${product!.category.name})`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Product Query - Invalid ID
// ============================================================================

async function testProductQueryInvalidId() {
  const testName = 'Product Query - Invalid ID (should return null)';
  try {
    const invalidId = 'non-existent-product-id-12345';

    const product = await resolvers.Query.product(parent, { id: invalidId }, context);

    assert(product === null, 'product should be null for invalid ID');

    logTestResult(testName, true, 'Correctly returned null for invalid ID');
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Categories Query
// ============================================================================

async function testCategoriesQuery() {
  const testName = 'Categories Query';
  try {
    const categories = await resolvers.Query.categories(parent, {}, context);

    assert(Array.isArray(categories), 'categories should be an array');

    // Validate each category has required fields
    categories.forEach(category => {
      assert(typeof category.id === 'string', 'category.id should be string');
      assert(typeof category.name === 'string', 'category.name should be string');
      assert(typeof category.slug === 'string', 'category.slug should be string');
    });

    // Verify categories are sorted by name
    for (let i = 1; i < categories.length; i++) {
      assert(
        categories[i - 1].name <= categories[i].name,
        'categories should be sorted by name'
      );
    }

    logTestResult(
      testName,
      true,
      `Found ${categories.length} categories: ${categories.map(c => c.name).join(', ')}`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// TEST: Combined Filters (Category + Price + Search)
// ============================================================================

async function testProductsQueryCombinedFilters() {
  const testName = 'Products Query - Combined Filters';
  try {
    const categories = await resolvers.Query.categories(parent, {}, context);
    if (categories.length === 0) {
      logTestResult(testName, true, 'Skipped - no categories available');
      return;
    }

    const input: ProductQueryInput = {
      filter: {
        category: categories[0].slug,
        minPrice: 50,
        maxPrice: 2000,
      },
      sortBy: 'PRICE_DESC' as ProductSortOption,
      limit: 10,
    };

    const result = await resolvers.Query.products(parent, { input }, context);

    assert(Array.isArray(result.products), 'products should be an array');

    // Validate all filters are applied
    result.products.forEach(product => {
      assert(
        product.category.slug === categories[0].slug,
        'product should match category filter'
      );
      assert(
        product.price >= 50 && product.price <= 2000,
        'product should match price filter'
      );
    });

    logTestResult(
      testName,
      true,
      `Found ${result.total} products with combined filters`
    );
  } catch (error) {
    logTestResult(testName, false, (error as Error).message);
    throw error;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  SESUC-102: Product Discovery Queries Test Suite         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  let passedTests = 0;
  let failedTests = 0;

  const tests = [
    testProductsQueryNoFilters,
    testProductsQueryCategoryFilter,
    testProductsQueryPriceFilter,
    testProductsQuerySearchFilter,
    testProductsQuerySortPriceAsc,
    testProductsQuerySortRatingDesc,
    testProductsQueryPagination,
    testProductQueryById,
    testProductQueryInvalidId,
    testCategoriesQuery,
    testProductsQueryCombinedFilters,
  ];

  for (const test of tests) {
    try {
      await test();
      passedTests++;
    } catch (error) {
      failedTests++;
      console.error(`   Error details: ${(error as Error).stack}`);
    }
    console.log(''); // Empty line between tests
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log(`\n📊 Test Results: ${passedTests} passed, ${failedTests} failed\n`);

  if (failedTests === 0) {
    console.log('🎉 All tests passed! Product Discovery Queries are working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }

  await prisma.$disconnect();
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Fatal error running tests:', error);
    prisma.$disconnect();
    process.exit(1);
  });
}

export { runAllTests };
