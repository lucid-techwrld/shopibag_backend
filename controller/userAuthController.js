require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const transporter = require("../utils/nodemailer");
const htmlContent = require("../utils/emailHtml");

const createAccount = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  const existingUser = await User.find({ email });
  if (existingUser.length > 0) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });

    try {
      const info = await transporter.sendMail({
        from: '"SHOPIBAG" <lucidtechwrld9@gmail.com>',
        to: email,
        subject: "Welcome to ShopiBag!✔",
        html: htmlContent,
      });
    } catch (emailError) {
      console.log(emailError);
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all fields" });
  }

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password" });
    }

    // Generate JWT and Refresh Token
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(
      { id: userExist._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    // Set cookies
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: isProd ? "Strict" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: isProd ? "Strict" : "Lax",
      maxAge: 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response with user details
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const logout = async (req, res, next) => {
  res.clearCookie("jwt");
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const checkLoginStatus = async (req, res) => {
  const token = req.cookies.jwt; // Get the JWT from cookies

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not logged in",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      success: true,
      message: "User is logged in",
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

const fetchUserProfile = async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      email: user.email,
    });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

module.exports = {
  createAccount,
  login,
  logout,
  checkLoginStatus,
  fetchUserProfile,
};
