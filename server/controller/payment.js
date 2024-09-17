const express = require("express");
const router = express.Router();

// Ensure dotenv is loaded
require("dotenv").config();

router.get("/key", async (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
});



module.exports = router;
