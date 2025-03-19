const Customer = require('../../models/Customer');
const { UserInputError, ApolloError } = require('apollo-server-express');

const recommendationResolvers = {
  Query: {
    customerRecommendations: async (_, { customerId, limit = 5 }, { services, loaders }) => {
      try {
        // Validate customer exists
        const customer = await loaders.customerLoader.load(customerId);
        
        if (!customer) {
          throw new UserInputError('Customer not found');
        }
        
        // Validate recommendation service is available
        if (!services.recommendationService) {
          throw new ApolloError('Recommendation service unavailable', 'SERVICE_UNAVAILABLE');
        }
        
        // Get recommendations from service
        const recommendations = await services.recommendationService.getRecommendations(customerId, limit);
        
        if (!recommendations || !Array.isArray(recommendations)) {
          throw new ApolloError('Invalid recommendations format', 'INVALID_RESPONSE');
        }
        
        // Use Promise.all to properly wait for all product loader promises
        return await Promise.all(recommendations.map(async (rec) => {
          try {
            const product = await loaders.productLoader.load(rec.productId);
            
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
  }
};

module.exports = recommendationResolvers;