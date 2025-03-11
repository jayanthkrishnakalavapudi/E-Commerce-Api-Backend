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
MONGO_URI=mongodb+srv://your_username:your_password@your-cluster.mongodb.net/ecommerce-api?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=7

```

You can customize these values as needed.

### 🖥 Local Development

1.  Clone the repository:

    ```sh
    git clone git@github.com:your-username/ecommerce-order-api.git
    cd ecommerce-order-api
    ```

2.  Install dependencies:

    ```sh
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file with the following:
    ```sh
    MONGO_URI=mongodb+srv://jayanth:fT4t1QcuGAG0NAPj@cluster0.k57vc.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=Cluster0
    PORT=5000
    JWT_SECRET=89072b77e5162146f0f1640c76522fb3818b13ef08a25d5054280b0663e61500ab31411ab779756d20fbb09025d2e1b51bd3960aa4e291d9339d6937aa109743
    JWT_EXPIRE=30d
    JWT_COOKIE_EXPIRE=30

        ```

4.  Start the server:
    ```sh
    node server.js
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

---

## 🌐 Deployment on Render

This project is deployed using **Render** at:

[**Live API URL**](https://e-commerce-api-backend-5ke0.onrender.com/)

### 🚀 Steps to Deploy on Render

1. Push your repository to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the branch to deploy.
4. Set up the environment variables as mentioned in `.env`.
5. Deploy the service and use the provided URL for API access.

---

## 🛠 REST API Endpoints

🔹 `GET /api/customers/{customerId}/orders` - Get all orders for a customer  
🔹 `GET /api/orders/{orderId}` - Get order details  
🔹 `POST /api/orders` - Create a new order  
🔹 `PUT /api/orders/{orderId}` - Update an order  
🔹 `DELETE /api/orders/{orderId}` - Cancel an order

---

## 💡 GraphQL Integration

This project includes **GraphQL** support for querying and mutating order, customer, and product data.

### 🐝 Sample Queries

🔹 Fetch an order by ID:

```graphql
query {
  order(id: "123") {
    id
    customer {
      name
      email
    }
    products {
      name
      price
    }
    status
  }
}
```

🔹 Create a new order:

```graphql
mutation {
  createOrder(input: { customerId: "123", products: ["456", "789"] }) {
    id
    status
  }
}
```

---

## ⚠️ Error Handling

❌ Invalid requests  
❌ Database errors  
❌ External service failures  
❌ Authentication/authorization issues

---
