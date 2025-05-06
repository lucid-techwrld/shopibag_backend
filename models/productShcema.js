const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: {type: String },
  category: {
      type: String,
      enum: ['men', 'women', 'kids', 'accessories', 'shoes', 'bags', 'nightwears'],
      required: true
    },
  quantity: { type: Number, required: true, default: 0 },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.models.products || mongoose.model('products', productSchema);
