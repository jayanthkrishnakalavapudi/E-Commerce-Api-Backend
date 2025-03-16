const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const ShippingService = require('../services/shippingService'); // Import ShippingService
const Order = require('../models/Order');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 */
router.route('/')
  .get(getProducts)
  .post(createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 */
router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);



/**
 * @swagger
 * /api/orders/{orderId}/tracking:
 *   get:
 *     summary: Get tracking information for an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to fetch tracking info for
 *     responses:
 *       200:
 *         description: Tracking information retrieved successfully
 *       404:
 *         description: Order not found or no tracking available
 *       500:
 *         description: Server error
 */
router.get('/orders/:orderId/tracking', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (!order.trackingNumber) {
            return res.status(404).json({ success: false, message: "No tracking information available" });
        }

        const trackingInfo = await ShippingService.getTrackingInfo(order.trackingNumber);

        res.json({ success: true, data: trackingInfo });
    } catch (error) {
        console.error('❌ Tracking Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
