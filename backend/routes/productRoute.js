const express = require('express');
const router = express.Router();
const {
  getAllProduct,
  addProduct,
  getProductCategory,
  getProductsQuantity,
  searchProducts,
  updateProduct,
  getProductById,
  deleteProduct,
} = require('../controller/productController');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public Routes
router.get('/all', getAllProduct); // Get all products
router.get('/stocks', getProductsQuantity); // Get total product quantity
router.get('/search', searchProducts); // Search products
router.get('/category/:category', getProductCategory);

// Protected Routes (Admin Only)
router.post('/add', verifyAdmin, addProduct); // Add a new product
router.delete('/delete/:id', verifyAdmin, deleteProduct); // Delete a product (must come before /:id)
router.patch('/update/:id', verifyAdmin, updateProduct); // Update a product (must come before /:id)

// Dynamic Route (must be last to avoid conflicts)
router.get('/:id', getProductById); // Get product by ID

module.exports = router;