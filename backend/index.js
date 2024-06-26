const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const exp = require('constants');
app.use(cors());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MongoURI)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("Failed to connect to MongoDB ❌", err));

app.use(express.json());

const BlogRoutes = require("./Routes/BlogRoutes")
const PetRoutes = require("./Routes/PetRoutes");

app.use('/blog', BlogRoutes);
app.use('/pet',PetRoutes)

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 server running on PORT: ${PORT}`);
});

// Razorpay routes

app.post("/order", async (req, res) => {
  try {
      const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET
      });


      if (!req.body) {
          return res.status(400).send("Bad Request");
      }

      const options = req.body;
      const order = await razorpay.orders.create(options);

      if (!order) {
          return res.status(400).send("Bad Request");
      }

      res.json(order);

  } catch (error) {
      console.log(error);
      res.status(500).send(error);
  }
})

app.post("/validate", async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  // order_id + " | " + razorpay_payment_id

  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: " Transaction is not legit!" });
  }

  res.json({ msg: " Transaction is legit!", orderId: razorpay_order_id, paymentId: razorpay_payment_id });
})
