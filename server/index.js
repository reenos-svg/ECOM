const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend origin
  credentials: true, // Allows sending cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// db connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("db COnnected");
});

// Ensure dotenv is loaded
require("dotenv").config();

// import user routes
const userRoutes = require("./controller/user");
const vendorRoutes = require("./controller/vendor");
const productRoutes = require("./controller/product");
const categoryRoutes = require("./controller/category");
const orderRoutes = require("./controller/order");
const newsletterRoutes = require("./controller/email");
const couponRoutes = require("./controller/coupon");
const withdrawalRoutes = require("./controller/withdrawl");
const paymentRoutes = require("./controller/payment");
const homepageRoutes = require("./controller/homepage");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/coupon", couponRoutes);
app.use("/api/v1/withdrawl", withdrawalRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/homepage", homepageRoutes);

app.listen(3000, () => {
  console.log("server running");
});
