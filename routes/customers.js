const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer
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
  .get(getCustomer);

  router.route('/:customerId/recommendations')
  .get((req, res) => {
    console.log("✅ Recommendation API hit with customerId:", req.params.customerId);
    res.json({ message: "Test response" });
  });

module.exports = router;