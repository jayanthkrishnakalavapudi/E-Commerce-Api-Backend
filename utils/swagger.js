const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce Order Management API',
      version: '1.0.0',
      description: 'A RESTful API for e-commerce order management',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'https://e-commerce-api-backend-1.onrender.com/',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {  // 🔹 Adding Bearer Token Authentication
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      security: [
        {
          BearerAuth: []
        }
      ],
      schemas: {
        Customer: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' }
              }
            },
            phone: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'category'],
          properties: {
            _id: { type: 'string', description: 'Auto-generated MongoDB ID' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number', format: 'float' },
            category: { type: 'string' },
            inventory: { type: 'integer', default: 0 },
            imageUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [  // 🔹 Apply security globally
      {
        BearerAuth: []
      }
    ],
    tags: [
      { name: 'Customers', description: 'Customer management endpoints' },
      { name: 'Products', description: 'Product catalog endpoints' },
      { name: 'Orders', description: 'Order processing endpoints' },
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Recommendations', description: 'Product recommendation endpoints' },
      { name: 'Tracking', description: 'Order tracking endpoints' }
    ]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = specs;
