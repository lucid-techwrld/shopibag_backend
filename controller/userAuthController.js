require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');   
const User = require('../models/userSchema');
const transporter = require('../utils/nodemailer');


const htmlContent = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #1976d2;">Welcome to ShopiBag!</h2>
    <p>Hi there,</p>
    <p>Thank you for signing up for <strong>ShopiBag</strong>. We're excited to have you on board!</p>
    <p>Here are some things you can do with your new account:</p>
    <ul>
        <li>Browse and shop for amazing products.</li>
        <li>Track your orders in real-time.</li>
        <li>Enjoy exclusive discounts and offers.</li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:support@shopibag.com" style="color: #1976d2; text-decoration: none;">support@shopibag.com</a>.</p>
    <p>Happy shopping!</p>
    <p style="margin-top: 20px;">Best regards,</p>
    <p><strong>The ShopiBag Team</strong></p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 12px; color: #777;">This is an automated email. Please do not reply to this email.</p>
</div>`

const createAccount = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({error: 'Please fill in all fields'});
    }

    const existingUser = await User.find({email});
    if(existingUser.length > 0) {
        return res.status(400).json({error: 'User already exists'});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new User({email, password:hashedPassword});
        const savedUser = await newUser.save(); 

        const info = await transporter.sendMail({
            from: '"SHOPIBAG" <lucidtechwrld9@gmail>',
            to: email,
            subject: "Welcome to ShopiBag!✔",
            html: htmlContent, 
          });

        console.log("Message sent: %s", info.messageId);
        res.status(201).json({success: true, message: 'User created successfully', user: savedUser});
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
}


const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT and Refresh Token
        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ id: userExist._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        // Set cookies
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: isProd ? 'Strict' : 'Lax',
            maxAge: 60 * 60 * 1000, 
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: isProd ? 'Strict' : 'Lax',
            maxAge: 24 * 60 * 60 * 1000, // 7 days
        });

        // Return success response with user details
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};

module.exports = {
    createAccount,
    login
};

