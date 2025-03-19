require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { createOrderLoader, createCustomerOrdersLoader } = require('./graphql/loaders/orderLoader');
const customerLoader = require('./graphql/loaders/customerLoader');
const productLoader = require('./graphql/loaders/productLoader');
const shippingService = require('./services/shippingService');

const app = express();
app.use(cors());

// Connect to MongoDB
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected successfully');
} catch (error) {
  console.error('MongoDB connection error:', error);
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    loaders: {
      orderLoader: createOrderLoader(),
      customerOrdersLoader: createCustomerOrdersLoader(),
      customerLoader,
      productLoader,
    },
    services: {
      shippingService,
    },
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();