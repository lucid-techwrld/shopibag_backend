const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/mongoDB");
const products = require("./routes/productRoute");
const uploadImage = require("./routes/uploadImage");
const adminLogin = require("./routes/adminRoute");
const errorHandler = require("./middleware/errorHandler");
const userAuth = require("./routes/authenticationRoute");
const cartRoute = require("./routes/cartRoutes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 5 requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after a minute.",
});

const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message:
    "Too many requests to the product API, please try again after 15 minutes.",
});

app.use("/auth", loginLimiter, adminLogin);
app.use("/api/v1/auth", loginLimiter, userAuth);
app.use("/api/v1/products", productLimiter, products);
app.use("/api/v1", productLimiter, cartRoute);

app.use("/api/image/", productLimiter, uploadImage);

connectDB();

app.use(errorHandler); // Error handling middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
