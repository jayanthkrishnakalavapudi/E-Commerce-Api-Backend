# ![E-commerce](https://img.icons8.com/ios-filled/50/000000/shopping-cart.png) E-commerce Order Management API

A **RESTful** and **GraphQL** API for an **e-commerce order management system**.

---

## 🚀 Features

✅ Customer management  
✅ Product catalog  
✅ Order processing  
✅ REST and GraphQL API support  
✅ MongoDB database

---

## 📌 Requirements

- ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png) **Node.js** 14+
- ![MongoDB](https://img.icons8.com/external-tal-revivo-filled-tal-revivo/24/000000/external-mongodb-a-cross-platform-document-oriented-database-program-logo-filled-tal-revivo.png) **MongoDB** 4.4+
- 🐳 **Docker** (optional)

---

## ⚙️ Installation

### 📄 Environment Variables (.env)

Create a `.env` file in the root directory and configure the following:

```sh
MONGO_URI=mongodb+srv://jayanth:fT4t1QcuGAG0NAPj@cluster0.k57vc.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=89072b77e5162146f0f1640c76522fb3818b13ef08a25d5054280b0663e61500ab31411ab779756d20fbb09025d2e1b51bd3960aa4e291d9339d6937aa109743
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

### 🖥 Local Development

1. Clone the repository:

    ```sh
    git clone git@github.com:your-username/ecommerce-order-api.git
    cd ecommerce-order-api
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    yarn start
    ```

### 🐳 Using Docker

1. Clone the repository
2. Run:
   ```sh
   docker-compose up
   ```

---

## 📚 API Documentation

API documentation is available at `/api-docs` when the server is running.

GraphQL is available at `/graphql`.

---

## 🌐 Deployment on Render

This project is deployed using **Render** at:

[**Live API URL**](https://e-commerce-api-backend-1.onrender.com/)

### 🚀 Steps to Deploy on Render

1. Push your repository to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the branch to deploy.
4. Set up the environment variables as mentioned in `.env`.
5. Deploy the service and use the provided URL for API access.
6. Use `yarn start` as the start command.

---

## 🛠 REST API Endpoints

### Authentication

#### POST `/auth/register`  
Register a new user

#### POST `/auth/login`  
Login a user

### Customers

#### GET `/api/customers`  
Get all customers

#### POST `/api/customers`  
Create a new customer

#### GET `/api/customers/{id}`  
Get a single customer by ID

#### PUT `/api/customers/{id}`  
Update a customer

#### DELETE `/api/customers/{id}`  
Delete a customer by ID

#### GET `/api/customers/search`  
Search customers

### Products

#### GET `/api/products`  
Get all products

#### POST `/api/products`  
Create a new product

#### GET `/api/products/{id}`  
Get a single product by ID

#### PUT `/api/products/{id}`  
Update an existing product

#### DELETE `/api/products/{id}`  
Delete a product

### Recommendations

#### GET `/api/customers/{customerId}/recommendations`  
Get product recommendations for a customer

### Orders

#### GET `/api/orders/{id}`  
Get a single order by ID

#### PUT `/api/orders/{id}`  
Update an existing order

#### DELETE `/api/orders/{id}`  
Cancel an order

#### POST `/api/orders`  
Create a new order

#### GET `/api/orders/{id}/tracking`  
Get tracking information for a specific order

---

## 💡 GraphQL Integration

This project includes **GraphQL** support for querying and mutating order, customer, and product data.

GraphQL API is available at `/graphql`.

### 🐝 Sample Queries

#### Fetch customers with pagination:
```graphql
query {
  customers(pagination: { page: 1, limit: 5 }) {
    customers {
      id
      name
      email
    }
    totalCount
    hasMore
  }
}
```

#### Fetch a specific customer and their orders:
```graphql
query {
  customer(id: "your-customer-id") {
    id
    name
    email
    orders {
      id
      items {
        quantity
      }
    }
  }
}
```

#### Fetch products with filters:
```graphql
query {
  products(
    filter: { category: "Electronics", minPrice: 50 }
    pagination: { page: 1, limit: 10 }
  ) {
    products {
      id
      name
      price
    }
    totalCount
    hasMore
  }
}
```

#### Fetch order details:
```graphql
query GetOrder {
  order(id: "your-order-id") {
    id
    status
    items {
      quantity
      price
    }
  }
}
```

---

## ⚠️ Error Handling

❌ Invalid requests  
❌ Database errors  
❌ External service failures  

