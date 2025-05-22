require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_KEY,
  },
});

module.exports = transporter;
