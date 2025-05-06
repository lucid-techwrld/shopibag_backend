const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/mongoDB');
const products = require('./routes/productRoute');
const uploadImage = require('./routes/uploadImage');
const adminLogin = require('./routes/adminLoginRouter');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4000'], // Allow requests from your React app
  credentials: true, // Allow cookies and credentials
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/image/', uploadImage);
app.use('/api/v1/products', products);
app.use('/admin', adminLogin);

// Connect to Database
connectDB();




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on PORT', PORT);
});