const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USERID,
      pass: process.env.NODEMAILER_PASS
    }
});

async function sendMail(mailOptions) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.response);
      return true;
    } catch (error) {
      console.error('Error sending email: ', error);
      return false;
    }
  }
  
module.exports = sendMail;