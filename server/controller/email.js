const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const Email = require("../models/email");
const router = express.Router();

// Subscribe to the newsletter
router.post(
  "/subscribe",
  catchAsyncError(async (req, res) => {
    try {
      const { address } = req.body;

      if (!address) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const email = new Email({ address });
      await email.save();

      res.status(201).json({ message: "Subscribed successfully" });
    } catch (error) {
      console.error("Error subscribing:", error);
      res
        .status(500)
        .json({ message: "Failed to subscribe", error: error.message });
    }
  })
);

// Route to get all orders, protected and role-based
router.get(
    "/emails",
    catchAsyncError(async (req, res, next) => {
      try {
        const emails = await Email.find({});
        res.status(200).json({
          success: true,
          emails,
        });
      } catch (error) {
        next(error);
      }
    })
  );

module.exports = router;
