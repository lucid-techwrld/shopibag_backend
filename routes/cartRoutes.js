const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controller/cartController");
const verifyUser = require("../middleware/verifyUser");

router.post("/addCart", verifyUser, addToCart);
router.post("/removeCart", verifyUser, removeFromCart);
router.get("/getCart", verifyUser, getCart);

module.exports = router;
