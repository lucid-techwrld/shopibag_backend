const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: 'process.env.SMTP_LOGIN', // your Brevo login email
    pass: 'process.env.SMTP_KEY',     // the SMTP key you generated
  },
})

module.exports = transporter;
