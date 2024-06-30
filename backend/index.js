const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const exp = require("constants");
app.use(cors());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MongoURI)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("Failed to connect to MongoDB ❌", err));

app.use(express.json());
app.use(bodyParser.json());

const BlogRoutes = require("./Routes/BlogRoutes");
const PetRoutes = require("./Routes/PetRoutes");
const sendMail = require("./nodemailer");

app.use("/blog", BlogRoutes);
app.use("/pet", PetRoutes);

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 server running on PORT: ${PORT}`);
});

// Nodemailer Routes

app.post("/sendMail", async (req, res) => {
  const mailOptions = req.body;
  try {
    const info = await sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send("Failed to send email.");
  }
});

// Razorpay routes

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

app.post("/checkout", async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});
