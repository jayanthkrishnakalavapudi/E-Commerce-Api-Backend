const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { getRecommendations } = require('../services/recommendationService');
const { getTrackingInfo } = require('../services/shippingService');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of products to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, name, createdAt]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               sku:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               category:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               sku:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/products/recommendations:
 *   get:
 *     summary: Get product recommendations
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category to get recommendations from
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of recommendations to retrieve
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *       404:
 *         description: No recommendations found
 *       500:
 *         description: Server error
 */
router.get('/recommendations', async (req, res) => {
  try {
      const { category, limit } = req.query;
      const recommendations = await getRecommendations(category, limit);

      if (!recommendations.length) {
          return res.status(404).json({ success: false, error: "No recommendations found" });
      }

      res.json({ success: true, data: recommendations });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
  }
});

/**
 * @swagger
 * /api/orders/{orderId}/tracking:
 *   get:
 *     summary: Get shipping status and tracking information
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to track
 *     responses:
 *       200:
 *         description: Tracking information retrieved successfully
 *       404:
 *         description: Order not found or tracking unavailable
 *       500:
 *         description: Server error
 */
router.get('/:orderId/tracking', async (req, res) => {
  try {
      const { orderId } = req.params;
      const trackingInfo = await getTrackingInfo(orderId);

      if (!trackingInfo) {
          return res.status(404).json({ success: false, error: "Tracking information not found" });
      }

      res.json({ success: true, data: trackingInfo });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
  }
});


router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;