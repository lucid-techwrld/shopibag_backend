const express = require("express");
const router = express.Router();
const {
  login,
  createAccount,
  logout,
  checkLoginStatus,
  fetchUserProfile,
} = require("../controller/userAuthController");
const verifyUser = require("../middleware/verifyUser");

router.post("/login", login);
router.post("/create-account", createAccount);
router.get("/logout", logout);
router.get("/checkLogin", checkLoginStatus);
router.get("/userProfile", verifyUser, fetchUserProfile);

module.exports = router;
