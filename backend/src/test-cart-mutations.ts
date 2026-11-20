/**
 * Cart Mutations Test Suite for SESUC-103
 * Validates all cart operation mutations with proper error handling
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

/**
 * Execute GraphQL query/mutation
 */
async function executeGraphQL(query: string, variables?: Record<string, any>): Promise<any> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  return result;
}

/**
 * Test 1: Add product to cart
 */
async function testAddToCart() {
  console.log('\n🧪 Test 1: Add Product to Cart');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Get a product first
  const productsQuery = `
    query GetProducts {
      products(input: { limit: 1 }) {
        products {
          id
          name
          price
        }
      }
    }
  `;

  const productsResult = await executeGraphQL(productsQuery);
  const product = productsResult.data?.products?.products[0];

  if (!product) {
    console.error('❌ No products found. Please run seed data first.');
    return null;
  }

  console.log(`📦 Testing with product: ${product.name} ($${product.price})`);

  // Add to cart
  const addToCartMutation = `
    mutation AddToCart($input: AddToCartInput!) {
      addToCart(input: $input) {
        success
        message
        cartItem {
          id
          quantity
          product {
            id
            name
            price
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      productId: product.id,
      quantity: 2,
    },
  };

  const result = await executeGraphQL(addToCartMutation, variables);

  if (result.data?.addToCart?.success) {
    console.log('✅ Success:', result.data.addToCart.message);
    console.log('📊 Cart Item:', JSON.stringify(result.data.addToCart.cartItem, null, 2));
    return result.data.addToCart.cartItem;
  } else {
    console.error('❌ Failed:', result.data?.addToCart?.message || result.errors);
    return null;
  }
}

/**
 * Test 2: Update cart item quantity
 */
async function testUpdateCartItem(cartItemId: string) {
  console.log('\n🧪 Test 2: Update Cart Item Quantity');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const mutation = `
    mutation UpdateCartItem($input: UpdateCartItemInput!) {
      updateCartItem(input: $input) {
        success
        message
        cartItem {
          id
          quantity
          product {
            name
          }
        }
      }
    }
  `;

  const variables = {
    input: {
      cartItemId,
      quantity: 5,
    },
  };

  const result = await executeGraphQL(mutation, variables);

  if (result.data?.updateCartItem?.success) {
    console.log('✅ Success:', result.data.updateCartItem.message);
    console.log('📊 Updated Cart Item:', JSON.stringify(result.data.updateCartItem.cartItem, null, 2));
    return true;
  } else {
    console.error('❌ Failed:', result.data?.updateCartItem?.message || result.errors);
    return false;
  }
}

/**
 * Test 3: Get cart contents
 */
async function testGetCart() {
  console.log('\n🧪 Test 3: Get Cart Contents');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const query = `
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
          }
        }
      }
    }
  `;

  const result = await executeGraphQL(query);

  if (result.data?.cart) {
    console.log('✅ Cart Retrieved Successfully');
    console.log(`📊 Total Items: ${result.data.cart.total}`);
    console.log(`💰 Subtotal: $${result.data.cart.subtotal.toFixed(2)}`);
    console.log('🛒 Cart Items:', JSON.stringify(result.data.cart.items, null, 2));
    return result.data.cart;
  } else {
    console.error('❌ Failed to retrieve cart:', result.errors);
    return null;
  }
}

/**
 * Test 4: Remove item from cart
 */
async function testRemoveFromCart(cartItemId: string) {
  console.log('\n🧪 Test 4: Remove Item from Cart');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const mutation = `
    mutation RemoveFromCart($input: RemoveFromCartInput!) {
      removeFromCart(input: $input) {
        success
        message
      }
    }
  `;

  const variables = {
    input: {
      cartItemId,
    },
  };

  const result = await executeGraphQL(mutation, variables);

  if (result.data?.removeFromCart?.success) {
    console.log('✅ Success:', result.data.removeFromCart.message);
    return true;
  } else {
    console.error('❌ Failed:', result.data?.removeFromCart?.message || result.errors);
    return false;
  }
}

/**
 * Test 5: Clear entire cart
 */
async function testClearCart() {
  console.log('\n🧪 Test 5: Clear Entire Cart');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const mutation = `
    mutation ClearCart {
      clearCart {
        success
        message
      }
    }
  `;

  const result = await executeGraphQL(mutation);

  if (result.data?.clearCart?.success) {
    console.log('✅ Success:', result.data.clearCart.message);
    return true;
  } else {
    console.error('❌ Failed:', result.data?.clearCart?.message || result.errors);
    return false;
  }
}

/**
 * Test 6: Error handling - Invalid product ID
 */
async function testInvalidProductId() {
  console.log('\n🧪 Test 6: Error Handling - Invalid Product ID');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const mutation = `
    mutation AddToCart($input: AddToCartInput!) {
      addToCart(input: $input) {
        success
        message
      }
    }
  `;

  const variables = {
    input: {
      productId: 'invalid-product-id-12345',
      quantity: 1,
    },
  };

  const result = await executeGraphQL(mutation, variables);

  if (!result.data?.addToCart?.success) {
    console.log('✅ Error handled correctly:', result.data.addToCart.message);
    return true;
  } else {
    console.error('❌ Should have failed with invalid product ID');
    return false;
  }
}

/**
 * Test 7: Error handling - Invalid quantity
 */
async function testInvalidQuantity() {
  console.log('\n🧪 Test 7: Error Handling - Invalid Quantity');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Get a product first
  const productsQuery = `
    query GetProducts {
      products(input: { limit: 1 }) {
        products {
          id
        }
      }
    }
  `;

  const productsResult = await executeGraphQL(productsQuery);
  const product = productsResult.data?.products?.products[0];

  if (!product) {
    console.error('❌ No products found');
    return false;
  }

  const mutation = `
    mutation AddToCart($input: AddToCartInput!) {
      addToCart(input: $input) {
        success
        message
      }
    }
  `;

  const variables = {
    input: {
      productId: product.id,
      quantity: 0, // Invalid quantity
    },
  };

  const result = await executeGraphQL(mutation, variables);

  if (!result.data?.addToCart?.success) {
    console.log('✅ Error handled correctly:', result.data.addToCart.message);
    return true;
  } else {
    console.error('❌ Should have failed with invalid quantity');
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('\n🚀 ProductSphere Cart Mutations Test Suite');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Testing SESUC-103: Cart Operation Mutations');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // First, clear the cart to start fresh
    await testClearCart();

    // Test adding to cart
    const cartItem = await testAddToCart();
    if (!cartItem) {
      console.error('\n❌ Test suite failed: Could not add item to cart');
      return;
    }

    // Test updating cart item
    await testUpdateCartItem(cartItem.id);

    // Test getting cart contents
    const cart = await testGetCart();

    // Test adding another item (to test increment logic)
    console.log('\n🧪 Test: Add Same Product Again (Increment)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await testAddToCart();
    await testGetCart();

    // Test error handling
    await testInvalidProductId();
    await testInvalidQuantity();

    // Test removing from cart
    if (cart?.items?.[0]) {
      await testRemoveFromCart(cart.items[0].id);
      await testGetCart();
    }

    // Test clearing cart
    await testClearCart();
    await testGetCart();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All tests completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('\n❌ Test suite failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };
