const mockRecommendationService = require('../mocks/recommendations'); // Ensure correct path
const Order = require('../models/Order');
const cache = require('../utils/cache');

class RecommendationService {
  async getCustomerRecommendations(customerId) {
    const cacheKey = `recommendations_${customerId}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log(`📦 Returning cached recommendations for ${customerId}`);
      return cachedData;
    }

    try {
      console.log(`🛒 Fetching orders for customer: ${customerId}`);
      const customerOrders = await Order.find({ 
        customerId,
        status: { $ne: 'cancelled' }
      });

      if (!customerOrders.length) {
        console.warn(`⚠️ No orders found for Customer ID: ${customerId}`);
        return [];
      }

      const previousProducts = new Set();
      customerOrders.forEach(order => {
        order.items.forEach(item => previousProducts.add(item.productId.toString()));
      });

      console.log(`🔍 Found ${previousProducts.size} previously purchased products`);

      // ✅ Fetch recommendations using Mock Service
      const recommendations = await mockRecommendationService.getRecommendations(
        customerId,
        Array.from(previousProducts)
      );

      cache.set(cacheKey, recommendations, 3600);
      return recommendations;

    } catch (error) {
      console.error('❌ Error fetching recommendations:', error);
      throw new Error('Unable to retrieve product recommendations at this time');
    }
  }
}

module.exports = new RecommendationService();
