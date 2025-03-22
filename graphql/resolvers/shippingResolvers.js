const Order = require('../../models/Order');
const { UserInputError, ApolloError } = require('apollo-server-express');

const shippingResolvers = {
  Query: {
    // Add a specific query for order tracking by ID
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
          // Use trackingNumber from order if available, otherwise use a shipping reference ID if that exists
          const trackingReference = order.trackingNumber || order.shippingReference || orderId;
          
          const trackingInfo = await services.shippingService.getTrackingInfo(trackingReference);
          
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
  },
  
  // Add a resolver for the Order.tracking field to make it match the schema
  Order: {
    tracking: async (order, _, { services }) => {
      // Skip if no shipping service available
      if (!services.shippingService) {
        return null;
      }
      
      // Skip if not shipped or delivered
      if (!['shipped', 'delivered'].includes(order.status)) {
        return null;
      }
      
      // Skip if no tracking number
      if (!order.trackingNumber && !order.shippingReference) {
        return null;
      }
      
      try {
        const trackingReference = order.trackingNumber || order.shippingReference;
        return await services.shippingService.getTrackingInfo(trackingReference);
      } catch (error) {
        console.error(`Error fetching tracking for order ${order.id}:`, error);
        return null; // Fail gracefully for the field resolver
      }
    }
  }
};

module.exports = shippingResolvers;