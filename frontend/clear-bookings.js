/**
 * Clear All Bookings Script
 * 
 * This script clears all booking data from localStorage:
 * - Cart items (hotelsphere-booking-storage)
 * - Completed orders (hotelsphere-orders)
 * 
 * Usage:
 * 1. Open your browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter
 * 4. Refresh the page
 */

(function clearAllBookings() {
  console.log('🧹 Clearing all HotelSphere bookings...');
  
  // Clear cart items
  const cartKey = 'hotelsphere-booking-storage';
  if (localStorage.getItem(cartKey)) {
    localStorage.removeItem(cartKey);
    console.log('✅ Cart cleared:', cartKey);
  } else {
    console.log('ℹ️  No cart data found');
  }
  
  // Clear completed orders
  const ordersKey = 'hotelsphere-orders';
  if (localStorage.getItem(ordersKey)) {
    localStorage.removeItem(ordersKey);
    console.log('✅ Orders cleared:', ordersKey);
  } else {
    console.log('ℹ️  No order data found');
  }
  
  console.log('🎉 All bookings cleared! Refresh the page to see changes.');
  console.log('💡 Tip: Press F5 or Cmd+R to refresh');
})();
