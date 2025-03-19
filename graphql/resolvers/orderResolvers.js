const mongoose = require('mongoose');
const { UserInputError, ApolloError } = require('apollo-server-express');
const Order = require('../../models/Order');

const orderResolvers = {
  Query: {
    orderTracking: async (_, { orderId }) => {
      // Your existing implementation
    },
    
    order: async (_, { id }) => {
      // Your existing implementation
    }
  },

  Order: {
    id: (order) => order._id.toString(),
    tracking: (order) => order.tracking || null,
    items: (order) => order.items || [],
    
    // Add this resolver for the customer field
    customer: async (order, _, { loaders }) => {
      if (!order.customer) {
        throw new ApolloError('Customer reference is missing for this order');
      }
      
      // Use the customer loader to fetch the customer data
      try {
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
    }
  }
};

module.exports = orderResolvers;