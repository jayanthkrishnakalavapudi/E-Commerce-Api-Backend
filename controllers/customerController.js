const CustomerService = require('../services/customerService');
const RecommendationService = require('../services/recommendationService');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management endpoints
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     description: Retrieves a paginated list of customers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of customers per page
 *     responses:
 *       200:
 *         description: List of customers
 */
exports.getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const result = await CustomerService.getCustomers(page, limit);

    res.status(200).json({
      success: true,
      count: result.data.length,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a single customer by ID
 *     tags: [Customers]
 *     description: Fetches a customer using their unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer data retrieved successfully
 *       404:
 *         description: Customer not found
 */
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await CustomerService.getCustomerById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     description: Adds a new customer to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 */
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await CustomerService.createCustomer(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     description: Updates an existing customer's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jayanth
 *               address:
 *                 type: string
 *                 example: 123 Main St, City, Country
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 */
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await CustomerService.updateCustomer(req.params.id, req.body);

    if (!customer) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     description: Removes a customer from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       204:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 */
exports.deleteCustomer = async (req, res, next) => {
  try {
    const result = await CustomerService.deleteCustomer(req.params.id);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/{id}/recommendations:
 *   get:
 *     summary: Get product recommendations for a customer
 *     tags: [Customers]
 *     description: Retrieves personalized product recommendations for a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of recommendations to return
 *     responses:
 *       200:
 *         description: List of product recommendations
 *       404:
 *         description: Customer not found
 *       503:
 *         description: Recommendation service unavailable
 */
exports.getCustomerRecommendations = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 5;
    
    // First check if the customer exists using your existing service
    try {
      await CustomerService.getCustomerById(customerId);
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({ success: false, error: 'Customer not found' });
      }
      throw error;
    }
    
    // Now get recommendations using your recommendation service
    const recommendations = await RecommendationService.getCustomerRecommendations(customerId);
    
    // Apply the limit parameter
    const limitedRecommendations = recommendations.slice(0, limit);

    res.status(200).json({
      success: true,
      count: limitedRecommendations.length,
      data: limitedRecommendations
    });
  } catch (error) {
    console.error('Error in getCustomerRecommendations:', error);
    if (error.message === 'Unable to retrieve product recommendations at this time') {
      return res.status(503).json({ 
        success: false, 
        error: 'Recommendation service unavailable', 
        message: error.message 
      });
    }
    next(error);
  }
};

/**
 * @swagger
 * /api/customers/search:
 *   get:
 *     summary: Search customers
 *     tags: [Customers]
 *     description: Search customers by name or email
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (minimum 2 characters)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of customers per page
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid search query
 */
exports.searchCustomers = async (req, res, next) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const result = await CustomerService.searchCustomers(query, page, limit);
    
    res.status(200).json({
      success: true,
      count: result.count,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};