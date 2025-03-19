const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { createOrderLoader, createCustomerOrdersLoader } = require('./graphql/loaders/orderLoader');
const productLoader = require('./graphql/loaders/productLoader');
const shippingService = require('./services/shippingService'); // Ensure this is imported
const recommendationService = require('./services/recommendationService'); // Ensure this is imported

const app = express();
app.use(cors());

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: () => ({
    loaders: {
      orderLoader: createOrderLoader(),
      customerOrdersLoader: createCustomerOrdersLoader(),
      productLoader, // Ensure productLoader is included
    },
    services: {
      shippingService, // Ensure shippingService is passed
      recommendationService, // Ensure recommendationService is passed
    },
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startServer();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
