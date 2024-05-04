const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());

mongoose
  .connect(process.env.MongoURI)
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("Failed to connect to MongoDB ❌", err));

app.use(express.json());

const BlogRoutes = require("./Routes/BlogRoutes")
const PetRoutes = require("./Routes/PetRoutes")

app.use('/blog', BlogRoutes);
app.use('/pet',PetRoutes)

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 server running on PORT: ${PORT}`);
});