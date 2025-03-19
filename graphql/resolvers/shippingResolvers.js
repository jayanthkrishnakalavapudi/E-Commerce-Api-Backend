const Order = require('../../models/Order');
const { UserInputError, ApolloError } = require('apollo-server-express');

const shippingResolvers = {
  Query: {
    orderTracking: async (_, { orderId }, { services }) => {
      try {
        // Input validation
        if (!orderId) {
          throw new UserInputError('Order ID is required');
        }

        // Find order with error handling
        let order;
        try {
          order = await Order.findById(orderId);
        } catch (dbError) {
          console.error('Database error when finding order:', dbError);
          throw new ApolloError('Error accessing order database', 'DATABASE_ERROR');
        }
        
        if (!order) {
          throw new UserInputError('Order not found');
        }
        
        // If order is not shipped or delivered, return null
        if (!['shipped', 'delivered'].includes(order.status)) {
          return null;
        }
        
        // Validate shipping service availability
        if (!services.shippingService) {
          throw new ApolloError('Shipping service unavailable', 'SERVICE_UNAVAILABLE');
        }
        
        // Get tracking info with error handling
        try {
          const trackingInfo = await services.shippingService.getTrackingInfo(order.trackingNumber || orderId);
          
          // Validate tracking info
          if (!trackingInfo) {
            console.warn(`No tracking information found for order ${orderId}`);
            return null;
          }
          
          return trackingInfo;
        } catch (error) {
          console.error('Error fetching tracking info:', error);
          throw new ApolloError(
            'Error fetching tracking information', 
            'SHIPPING_SERVICE_ERROR',
            { originalError: error }
          );
        }
      } catch (error) {
        // Handle any other unexpected errors
        if (error instanceof UserInputError || error instanceof ApolloError) {
          throw error; // Re-throw Apollo errors
        }
        
        console.error('Unexpected error in orderTracking resolver:', error);
        throw new ApolloError('Unexpected error occurred', 'INTERNAL_SERVER_ERROR');
      }
    }
  }
};

module.exports = shippingResolvers;