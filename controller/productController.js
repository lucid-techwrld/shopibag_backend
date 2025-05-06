const Product = require('../models/productShcema');
const supabase = require('../utils/supabaseClient');
const validator = require('validator'); // For validation
const sanitizeHtml = require('sanitize-html'); // For sanitization

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};


const addProduct = async (req, res) => {
    console.log(req.body);
    const { category, description, imageUrl, name, price, quantity } = req.body;
    const imagePath = imageUrl.split('/').slice(-2).join('/');

    // Validation
    if (!category || !imageUrl || !name || !price || !quantity) {
        await supabase.storage.from('shopibag-product-images').remove([imagePath]);
        return res.status(400).json({ success: false, message: 'Invalid Credential' });
    }

    if (!validator.isURL(imageUrl, { protocols: ['http', 'https'], require_protocol: true })) {
        return res.status(400).json({ success: false, message: 'Invalid image URL' });
    }

    if (!validator.isNumeric(price.toString()) || price <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    if (!validator.isInt(quantity.toString(), { min: 1 })) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
    }

    // Sanitization
    const sanitizedCategory = sanitizeHtml(category, { allowedTags: [], allowedAttributes: {} });
    const sanitizedDescription = sanitizeHtml(description, { allowedTags: [], allowedAttributes: {} });
    const sanitizedName = sanitizeHtml(name, { allowedTags: [], allowedAttributes: {} });

    try {
        const newProduct = new Product({
            name: sanitizedName,
            price,
            description: sanitizedDescription,
            quantity,
            imageUrl,
            category: sanitizedCategory,
        });
        await newProduct.save();
        return res.status(201).json({ message: 'Product added successfully', newProduct });
    } catch (error) {
        console.log(error.message, 'Error uploading product');
        await supabase.storage.from('shopibag-product-images').remove([imagePath]);
        return res.status(500).json({ error: 'Failed to save product' });
    }
};

const getProductCategory = async (req, res) => {
    const { category } = req.params;
    console.log(category);

    if (!category) {
        return res.status(400).json({
            success: false,
            msg: 'Please provide a category',
        });
    }

    try {
        const sanitizedCategory = sanitizeHtml(category, { allowedTags: [], allowedAttributes: {} });
        const products = await Product.find({ category: sanitizedCategory });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                msg: `No products found for category: ${sanitizedCategory}`,
            });
        }

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error fetching products',
            error: error.message,
        });
    }
};

const getProductsQuantity = async (req, res) => {
    try {
        const productQuantity = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: {
                        $sum: "$quantity"
                    }
                }
            }
        ]);

        // Handle empty result
        return res.status(200).json({
            success: true,
            totalQuantity: productQuantity[0]?.totalQuantity || 0,
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        return res.status(500).json({
            success: false,
            msg: 'Error occurred, please try again later',
        });
    }
};



const searchProducts = async (req, res) => {
  try {
    // Get the query from the request
    let query = req.query.query || '';

    // Validate that the query is a string
    if (!validator.isAscii(query)) {
      return res.status(400).json({ success: false, message: 'Invalid query format' });
    }

    // Sanitize the query to remove any malicious content
    query = sanitizeHtml(query, { allowedTags: [], allowedAttributes: {} }).toLowerCase();

    // Search for products by name or category
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching products', error: error.message });
  }
};

module.exports = { getAllProduct, addProduct, getProductCategory, getProductsQuantity, searchProducts };