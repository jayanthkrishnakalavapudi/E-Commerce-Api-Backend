const mongoose = require('mongoose');
const { UserInputError, ApolloError } = require('apollo-server-express');
const Order = require('../../models/Order');

const orderResolvers = {
  Query: {
    orderTracking: async (_, { orderId }) => {
      try {
        // ✅ Validate if orderId is a proper MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
          throw new UserInputError('Invalid Order ID format');
        }

        // ✅ Convert to ObjectId and fetch the order
        const order = await Order.findById(new mongoose.Types.ObjectId(orderId));

        if (!order) {
          throw new UserInputError('Order not found');
        }

        // ✅ Ensure tracking data exists
        if (!order.tracking) {
          throw new ApolloError('Tracking information not available for this order');
        }

        return order.tracking;
      } catch (error) {
        console.error('Error fetching order tracking:', error);
        throw new ApolloError('Failed to fetch order tracking');
      }
    },

    order: async (_, { id }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Invalid Order ID format');
        }

        const order = await Order.findById(new mongoose.Types.ObjectId(id));
        if (!order) {
          throw new UserInputError('Order not found');
        }

        return order;
      } catch (error) {
        console.error('Error fetching order:', error);
        throw new ApolloError('Failed to fetch order');
      }
    }
  },

  Order: {
    id: (order) => order._id.toString(),
    tracking: (order) => order.tracking || null, // Ensure tracking is properly resolved
    items: (order) => order.items || [], // Ensure items are properly resolved
  }
};

module.exports = orderResolvers;
