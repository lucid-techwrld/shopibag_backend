const mongoose = require('mongoose')


const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

}, { _id: false })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [cartItemSchema], // Embedded array of cart items
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
