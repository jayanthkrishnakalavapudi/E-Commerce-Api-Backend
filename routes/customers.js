const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { getCustomerRecommendations } = require('../controllers/recommendationController');
const orderRoutes = require('./orders');

const router = express.Router();

// Re-route into order router
router.use('/:customerId/orders', orderRoutes);

router.route('/')
  .get(getCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

router.route('/:customerId/recommendations')
  .get(getCustomerRecommendations);

module.exports = router;