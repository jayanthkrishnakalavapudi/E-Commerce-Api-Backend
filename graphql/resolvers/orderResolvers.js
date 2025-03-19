const { UserInputError, ApolloError } = require('apollo-server-express');
const Order = require('../../models/Order');

const orderResolvers = {
  Query: {
    orderTracking: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new UserInputError(`Order not found: ${orderId}`);
        }
        return order.tracking || null;
      } catch (error) {
        throw new ApolloError('Error retrieving tracking information');
      }
    },

    order: async (_, { id }) => {
      try {
        const order = await Order.findById(id);
        if (!order) {
          throw new UserInputError(`Order not found: ${id}`);
        }
        return order;
      } catch (error) {
        throw new ApolloError('Error retrieving order');
      }
    },
  },

  Order: {
    id: (order) => order._id.toString(),
    tracking: (order) => order.tracking || null,
    items: (order) => order.items || [],
    
    customer: async (order, _, { loaders }) => {
      if (!order.customer) return null;
      
      try {
        const customerId = order.customer.toString();
        const customer = await loaders.customerLoader.load(customerId);
        return customer;
      } catch (error) {
        throw new ApolloError('Error loading customer data');
      }
    },
  },

  OrderItem: {
    product: async (orderItem, _, { loaders }) => {
      try {
        // Check if product reference exists
        if (!orderItem.product) {
          console.log('Missing product reference for order item:', orderItem);
          return null;
        }
        
        // Check if loader exists
        if (!loaders || !loaders.productLoader) {
          console.error('Product loader not found in context');
          throw new ApolloError('Product data loader not available');
        }
        
        // Convert ObjectId to string if needed
        const productId = orderItem.product.toString();
        
        // Load the product using DataLoader
        const product = await loaders.productLoader.load(productId);
        
        if (!product) {
          console.log(`Product with ID ${productId} not found`);
          return null;
        }
        
        return product;
      } catch (error) {
        console.error('Error loading product:', error.message);
        // Return null instead of throwing to prevent breaking the entire response
        return null;
      }
    }
  }
};

module.exports = orderResolvers;