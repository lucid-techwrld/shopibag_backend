const express = require('express');
const router = express.Router();
const {
  getAllProduct,
  addProduct,
  getProductCategory,
  getProductsQuantity,
  searchProducts
} = require('../controller/productController');
const verifyAdmin = require('../middleware/verifyAdmin'); // Import the middleware

// Public Routes
router.get('/all', getAllProduct);
router.get('/category/:category', getProductCategory);
router.get('/stocks', getProductsQuantity);
router.get('/search', searchProducts)

// Protected Routes (Admin Only)
router.post('/add', verifyAdmin, addProduct); // Add verifyAdmin middleware here

module.exports = router;