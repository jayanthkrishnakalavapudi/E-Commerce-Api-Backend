const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Address {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  type Customer {
    id: ID!
    name: String!
    email: String!
    address: Address
    phone: String
    orders: [Order]
    recommendations: [Product]
    createdAt: String
    updatedAt: String
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    category: String!
    inventory: Int!
    imageUrl: String
    createdAt: String
    updatedAt: String
  }

  type OrderItem {
    id: ID
    product: Product
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    customer: Customer
    orderDate: String!
    status: String!
    items: [OrderItem!]!
    shippingAddress: Address
    totalAmount: Float!
    tracking: ShippingInfo
    createdAt: String
    updatedAt: String
  }

  type ShippingInfo {
    trackingId: String
    carrier: String
    status: String
    estimatedDelivery: String
    history: [ShippingEvent]
  }

  type ShippingEvent {
    date: String
    status: String
    location: String
    description: String
  }

  type Recommendation {
    product: Product!
    score: Float
    reason: String
  }

  type PaginatedCustomers {
    customers: [Customer!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type PaginatedProducts {
    products: [Product!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  type PaginatedOrders {
    orders: [Order!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  input AddressInput {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input ProductFilterInput {
    category: String
    minPrice: Float
    maxPrice: Float
    search: String
  }

  input OrderFilterInput {
    status: String
    startDate: String
    endDate: String
  }

  input PaginationInput {
    page: Int
    limit: Int
    cursor: String
  }

  type Query {
    # Customer queries
    customer(id: ID!): Customer
    customers(filter: PaginationInput): PaginatedCustomers
    customerRecommendations(customerId: ID!, limit: Int): [Recommendation!]!
    
    # Product queries
    product(id: ID!): Product
    products(filter: ProductFilterInput, pagination: PaginationInput): PaginatedProducts
    
    # Order queries
    order(id: ID!): Order
    orders(filter: OrderFilterInput, pagination: PaginationInput): PaginatedOrders
    orderTracking(orderId: ID!): ShippingInfo
  }

  type Mutation {
    # Customer mutations
    createCustomer(name: String!, email: String!, address: AddressInput, phone: String): Customer
    updateCustomer(id: ID!, name: String, email: String, address: AddressInput, phone: String): Customer
    deleteCustomer(id: ID!): Boolean
    
    # Product mutations
    createProduct(name: String!, description: String!, price: Float!, category: String!, inventory: Int!, imageUrl: String): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, category: String, inventory: Int, imageUrl: String): Product
    deleteProduct(id: ID!): Boolean
    
    # Order mutations
    createOrder(customerId: ID!, items: [OrderItemInput!]!, shippingAddress: AddressInput): Order
    updateOrderStatus(id: ID!, status: String!): Order
    cancelOrder(id: ID!): Order
  }
`;

module.exports = typeDefs;