const express = require("express");
const Vendor = require("../models/vendor");
const router = express.Router();
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const { isVendor, isAdmin } = require("../middleware/auth");
const order = require("../models/order");
const { default: mongoose } = require("mongoose");
const vendor = require("../models/vendor");

// route to register as a vendor
router.post("/register", async (req, res, next) => {
  try {
    // Extract details from the body
    const { name, email, password, phoneNumber, address, zipcode } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if vendor already exists
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return next(new ErrorHandler("Vendor already exists", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create vendor object
    const vendor = new Vendor({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      zipcode,
    });

    // Save the new vendor to the database
    const newVendor = await vendor.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      vendor: {
        id: newVendor._id,
        role: newVendor.role,
      },
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

// route to login as a vendor
router.post("/login", async (req, res, next) => {
  const cookie = req.cookies.token;

  try {
    // Extract details from the body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if vendor exists
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare passwords
    if (!vendor.password) {
      return next(
        new ErrorHandler("Password is not defined in the database", 500)
      );
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return next(new ErrorHandler("JWT secret is not defined", 500));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 3600),
      httpOnly: true,
      secure: "production",
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      vendorId: vendor._id,
      role: vendor.role,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

// Route to get all vendors, protected and role-based
router.get(
  "/vendors",
  isAdmin,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const vendors = await Vendor.find({});
      res.status(200).json({
        success: true,
        vendors,
      });
    } catch (error) {
      next(error);
    }
  })
);

// Route to get all orders for a specific vendor
router.get("/:vendorId/orders", isVendor, async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Find orders where any of the orderItems have the specified vendor
    const orders = await order
      .find({
        orderItems: { $elemMatch: { vendor: vendorId } },
      })
      .populate({
        path: "orderItems.product",
        select: "productName discountedProductPrice", // Only select the productName field
      });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this vendor." });
    }

    // Filter out orderItems that don't match the vendorId
    const filteredOrders = orders
      .map((order) => {
        order.orderItems = order.orderItems.filter(
          (item) => item.vendor.toString() === vendorId
        );
        return order;
      })
      .filter((order) => order.orderItems.length > 0); // Remove orders with no matching orderItems

    if (!filteredOrders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this vendor." });
    }

    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
});

// route to get vendor details
router.get(
  "/get-vendor",
  isVendor,
  catchAsyncErrors(async (req, res, next) => {
    const vendor = await Vendor.findById(req.vendor.id, "-password").populate(
      "products"
    );

    if (!vendor) {
      return next(new ErrorHandler("Vendor doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  })
);

// route to update the vendor details
router.put(
  "/update-vendor",
  isVendor,
  catchAsyncErrors(async (req, res, next) => {
    const vendorId = req.vendor.id;
    const updatedData = req.body;

    const vendor = await Vendor.findByIdAndUpdate(vendorId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return next(new ErrorHandler("vendor doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  })
);

// delete a vendor for admin
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findByIdAndDelete(vendorId);
    if (!vendor) {
      res.status(200).json({ message: "Vendor doesn't exsist" });
    }
    res.status(200).json({ message: "Vendor account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vendor account", error });
  }
});

// route to get the vendor orders
router.get(
  "/get-vendor-orders",
  isVendor,
  catchAsyncErrors(async (req, res, next) => {
    const vendor = await Vendor.findById(req.vendor.id, "-password").populate(
      "orders"
    );

    if (!vendor) {
      return next(new ErrorHandler("Vendor doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      vendor,
    });
  })
);

// route to get venor dashboard details
router.get(
  "/orders/summary",
  isVendor,
  catchAsyncErrors(async (req, res) => {
    const vendorId = req.vendor.id;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    try {
      const vendorObjectId = new mongoose.Types.ObjectId(vendorId);
      const totalOrders = await order.countDocuments({
        "orderItems.vendor": vendorObjectId,
      });

      // Count cancelled orders
      const cancelledOrdersCount = await order.countDocuments({
        "orderItems.vendor": vendorObjectId,
        orderStatus: "Cancelled", 
      });

      const totalValue = await order.aggregate([
        { $match: { "orderItems.vendor": vendorObjectId } },
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$totalPrice" },
            totalValueAfterDiscount: { $sum: "$totalPriceAfterDiscount" },
          },
        },
      ]);

      // Fetch vendor balance
      const vendorBalance = await vendor
        .findById(vendorObjectId)
        .select("balance");

      res.json({
        cancelledOrdersCount,
        totalOrders,
        totalValue: totalValue[0]?.totalValue || 0,
        totalValueAfterDiscount: totalValue[0]?.totalValueAfterDiscount || 0,
        vendorBalance,
      });
    } catch (error) {
      console.error("Error fetching order summary:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

module.exports = router;
