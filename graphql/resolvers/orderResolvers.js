const { UserInputError, ApolloError } = require('apollo-server-express');
const Order = require('../../models/Order');

const orderResolvers = {
  Query: {
    orderTracking: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new UserInputError(`Order with ID ${orderId} not found`);
        }
        return order.tracking || null;
      } catch (error) {
        console.error('Error fetching order tracking:', error);
        throw new ApolloError('Failed to fetch order tracking');
      }
    },
    order: async (_, { id }) => {
      try {
        const order = await Order.findById(id);
        if (!order) {
          throw new UserInputError(`Order with ID ${id} not found`);
        }
        return order;
      } catch (error) {
        console.error('Error fetching order:', error);
        throw new ApolloError('Failed to fetch order details');
      }
    },
    // Add a resolver for multiple orders if needed
    orders: async (_, args) => {
      try {
        const orders = await Order.find({});
        return orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new ApolloError('Failed to fetch orders');
      }
    },
  },
  Order: {
    id: (order) => order._id.toString(), // Changed from order.id to order._id
    tracking: (order) => order.tracking || null,
    items: (order) => order.items || [],
    customer: async (order, _, { loaders }) => {
      try {
        // Check if loaders exists
        if (!loaders || !loaders.customerLoader) {
          throw new ApolloError('Customer loader not available');
        }
        
        // Check if customer field exists
        if (!order.customer && !order.customerId) {
          return null; // Return null instead of throwing error
        }
        
        // Use either customer or customerId depending on schema
        const customerId = (order.customer) ? 
          order.customer.toString() : 
          order.customerId.toString();
          
        const customer = await loaders.customerLoader.load(customerId);
        return customer; // Return null if customer not found
      } catch (error) {
        console.error('Error loading customer data:', error);
        throw new ApolloError('Failed to load customer data');
      }
    },
  },
};

module.exports = orderResolvers;