const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet'); // Import helmet for security headers
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
const connectDB = require('./config/mongoDB');
const products = require('./routes/productRoute');
const uploadImage = require('./routes/uploadImage');
const adminLogin = require('./routes/adminLoginRouter');

const app = express();

// Middleware
app.use(helmet()); // Use helmet for security headers
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4000'], // Allow requests from your React app
  credentials: true, // Allow cookies and credentials
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after a minute.',
});

const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per windowMs
  message: 'Too many requests to the product API, please try again after 15 minutes.',
});

// Routes with Rate Limiting
app.use('/admin', loginLimiter, adminLogin); // Apply login rate limiter
app.use('/api/v1/products', productLimiter, products); // Apply product rate limiter

// Other Routes
app.use('/api/image/', productLimiter, uploadImage);

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on PORT', PORT);
});