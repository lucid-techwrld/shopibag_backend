const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [1, "Name must be at least 1 character"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      set: (value) =>
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }), // Sanitize input
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0.01, "Price must be greater than 0"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      set: (value) =>
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }), // Sanitize input
    },
    category: {
      type: String,
      enum: [
        "men",
        "women",
        "kids",
        "accessories",
        "shoes",
        "bags",
        "nightwears",
      ],
      required: [true, "Category is required"],
      set: (value) =>
        sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }), // Sanitize input
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "stock must be at least 1"],
      default: 0,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: (value) =>
          /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(value),
        message: "Invalid image URL",
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.products || mongoose.model("products", productSchema);
