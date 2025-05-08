const Product = require('../models/productShcema');
const supabase = require('../utils/supabaseClient');
const { deleteImageFromSupabase } = require('../utils/supabaseDelete'); // Import the utility function

const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const addProduct = async (req, res, next) => {
  const { imageUrl } = req.body;
  const imagePath = imageUrl?.split('/').slice(-2).join('/');

  try {
    const newProduct = new Product(req.body); // Schema handles validation and sanitization
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully', newProduct });
  } catch (error) {
    if (imagePath) {
      await deleteImageFromSupabase(imagePath); // Use the utility function
    }
    next(error); // Pass the error to the error handler middleware
  }
};

const getProductCategory = async (req, res, next) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: `No products found for category: ${category}` });
    }
    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const getProductsQuantity = async (req, res, next) => {
  try {
    const productQuantity = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalQuantity: productQuantity[0]?.totalQuantity || 0,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const query = req.query.query?.toLowerCase() || '';
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure schema validation is applied
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product updated successfully', updatedProduct });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const imagePath = product.imageUrl?.split('/').slice(-2).join('/');

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    // Delete the image from Supabase
    if (imagePath) {
      await deleteImageFromSupabase(imagePath);
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

module.exports = {
  getAllProduct,
  addProduct,
  getProductCategory,
  getProductsQuantity,
  searchProducts,
  updateProduct,
  getProductById,
  deleteProduct,
};