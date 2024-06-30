const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jahnavreddy12@gmail.com',
      pass: 'qevl rujy xjel mbgs'
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