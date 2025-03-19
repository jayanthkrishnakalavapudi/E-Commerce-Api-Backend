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
  },

  Order: {
    id: (order) => order._id.toString(),

    tracking: (order) => order.tracking || null,

    items: (order) => order.items || [],

    customer: async (order, _, { loaders }) => {
      try {
        if (!order.customer) {
          throw new ApolloError('Customer reference is missing for this order');
        }

        const customerId = order.customer.toString();
        const customer = await loaders.customerLoader.load(customerId);

        if (!customer) {
          throw new ApolloError(`Customer with ID ${customerId} not found`);
        }

        return customer;
      } catch (error) {
        console.error('Error loading customer data:', error);
        throw new ApolloError('Failed to load customer data');
      }
    },
  },
};

module.exports = orderResolvers;
