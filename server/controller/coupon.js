const express = require("express");
const Coupon = require("../models/coupons");
const { isVendor } = require("../middleware/auth");
const router = express.Router();

// Create a new coupon
router.post("/create-coupon", isVendor, async (req, res) => {
  const {
    code,
    description,
    discountAmount,
    validFrom,
    validUntil,
    minOrderAmount,
    validCategories,
  } = req.body;
  const vendorId = req.vendor.id; // Assuming vendorId is available in req.vendor
  
  try {
    const newCoupon = new Coupon({
      code,
      description,
      discountAmount,
      validFrom,
      validUntil,
      minOrderAmount,
      validCategories,
      createdBy: vendorId,
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon: savedCoupon,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get all coupons
router.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().populate("createdBy", "name email"); // Adjust as per your vendor model
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get a single coupon by ID
router.get("/coupons/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate(
      "createdBy",
      "name email"
    ); // Adjust as per your vendor model
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get coupons by vendor ID
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const coupons = await Coupon.find({ createdBy: req.params.vendorId });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
// Update a coupon
router.put("/:id", async (req, res) => {
  const {
    code,
    description,
    discountAmount,
    validFrom,
    validUntil,
    minOrderAmount,
    validCategories,
    status,
  } = req.body;
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        code,
        description,
        discountAmount,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        minOrderAmount,
        validCategories,
        status,
      },
      { new: true }
    );

    if (coupon) {
      res.json(coupon);
    } else {
      res.status(404).json({ error: "Coupon not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a coupon
router.delete("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (coupon) {
      res.status(204).json({
        sucess: true,
        message: "Deleted",
      });
    } else {
      res.status(404).json({ error: "Coupon not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply a coupon
router.post("/apply", async (req, res) => {
  const { code, orderAmount, category } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });


    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    const now = new Date();
    if (now > coupon.validUntil) {
      return res.status(400).json({ error: "Coupon expired" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ error: "Order amount too low" });
    }

    // if (
    //   coupon.validCategories.length > 0 &&
    //   !coupon.validCategories.includes(category)
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "Coupon not valid for this category" });
    // }

    res.json({ isValid: true, discount: coupon.discountAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
