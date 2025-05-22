const User = require("../models/userSchema");
const Product = require("../models/productShcema");

const addToCart = async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please login to add product to cart" });
    }

    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      user.cart[existingProductIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    const populatedCart = await User.findById(userId)
      .populate({
        path: "cart.productId",
        select: "name price imageUrl",
      })
      .select("cart"); // Only return the cart field

    const totalQuantity = populatedCart.cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart.cart,
      cartTotal: totalQuantity,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Please login to remove product from cart" });
    }

    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Decrease the quantity
      user.cart[existingProductIndex].quantity -= 1;

      // Remove the product if the quantity is 0 or less
      if (user.cart[existingProductIndex].quantity <= 0) {
        user.cart.splice(existingProductIndex, 1);
      }

      await user.save();

      // Populate the updated cart with product details
      const populatedCart = await User.findById(userId)
        .populate({
          path: "cart.productId",
          select: "name price imageUrl",
        })
        .select("cart");

      const totalQuantity = populatedCart.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        cart: populatedCart.cart,
        cartTotal: totalQuantity,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const user = await User.findById(userId)
      .populate({
        path: "cart.productId",
        select: "name price imageUrl",
      })
      .select("cart"); // Only return the cart field

    if (!user || !user.cart) {
      return res.json({ success: true, cart: [], cartTotal: 0 });
    }

    // Calculate the total quantity of items in the cart
    const cartTotal = user.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    res.json({
      success: true,
      cart: user.cart,
      cartTotal,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart data",
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
