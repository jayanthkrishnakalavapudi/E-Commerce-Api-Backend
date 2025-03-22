const Customer = require('../../models/Customer');
const { UserInputError, ApolloError } = require('apollo-server-express');

const recommendationResolvers = {
  Query: {
    customerRecommendations: async (_, { customerId, limit = 5 }, context) => {
      try {
        // Validate customer exists
        const customer = await context.loaders.customerLoader.load(customerId);
        
        if (!customer) {
          throw new UserInputError('Customer not found');
        }
        
        // Validate recommendation service is available
        if (!context.recommendationService) {
          throw new ApolloError('Recommendation service unavailable', 'SERVICE_UNAVAILABLE');
        }
        
        // Get recommendations from service - using the correct method name
        const recommendations = await context.recommendationService.getCustomerRecommendations(customerId);
        
        if (!recommendations || !Array.isArray(recommendations)) {
          throw new ApolloError('Invalid recommendations format', 'INVALID_RESPONSE');
        }
        
        // Apply limit to the recommendations
        const limitedRecommendations = recommendations.slice(0, limit);
        
        // Use Promise.all to properly wait for all product loader promises
        return await Promise.all(limitedRecommendations.map(async (rec) => {
          try {
            const product = await context.loaders.productLoader.load(rec.productId);
            
            if (!product) {
              console.warn(`Product not found for recommendation: ${rec.productId}`);
              return null;
            }
            
            return {
              product,
              score: rec.score || 0,
              reason: rec.reason || 'No reason provided'
            };
          } catch (productError) {
            console.error(`Error loading product ${rec.productId}:`, productError);
            return null;
          }
        })).then(results => results.filter(Boolean)); // Filter out null results
      } catch (error) {
        console.error('Error in customerRecommendations resolver:', error);
        throw new ApolloError(
          'Error fetching recommendations', 
          error.name === 'UserInputError' ? 'USER_INPUT_ERROR' : 'RECOMMENDATION_SERVICE_ERROR',
          { originalError: error }
        );
      }
    }
  },
  
  Customer: {
    recommendations: async (customer, _, context) => {
      // If recommendation service is not available, return empty array
      if (!context.recommendationService) {
        return [];
      }
      
      try {
        // Use the correct method name
        const recommendations = await context.recommendationService.getCustomerRecommendations(customer.id);
        
        if (!recommendations || !Array.isArray(recommendations)) {
          return [];
        }
        
        // Limit to 5 recommendations
        const limitedRecommendations = recommendations.slice(0, 5);
        
        // Map recommendations to products only as per schema
        const productIds = limitedRecommendations.map(rec => rec.productId);
        return await Promise.all(productIds.map(id => context.loaders.productLoader.load(id)))
          .then(products => products.filter(Boolean));
      } catch (error) {
        console.error(`Error fetching recommendations for customer ${customer.id}:`, error);
        return []; // Return empty array on error for better UX
      }
    }
  }
};

module.exports = recommendationResolvers;