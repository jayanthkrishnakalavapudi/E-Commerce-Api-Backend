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
        if (!orderItem.product) {
          throw new ApolloError('Product reference is missing for this order item');
        }
        
        const productId = orderItem.product.toString();
        const product = await loaders.productLoader.load(productId);
        
        if (!product) {
          throw new ApolloError(`Product with ID ${productId} not found`);
        }
        
        return product;
      } catch (error) {
        throw new ApolloError('Failed to load product data');
      }
    }
  }
};

module.exports = orderResolvers;