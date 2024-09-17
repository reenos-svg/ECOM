const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");
const order = require("../models/order");
const vendor = require("../models/vendor");
const product = require("../models/product");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment");

// Ensure dotenv is loaded
require("dotenv").config();

// const sendMail = require("../utils/sendMail");
// const sendToken = require("../utils/jwtToken");
// const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Ensure dotenv is loaded
require("dotenv").config();

router.post("/register", async (req, res, next) => {
  try {
    // Extract details from the body
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 1 hour
    });

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: "production",
      expires: new Date(Date.now() + 1000 * 3600),
      sameSite: "strict",
      maxAge: 24 * 60 * 60 , // 7 days
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        role: newUser.role,
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // Extract details from the body
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Compare passwords
    if (!user.password) {
      return next(
        new ErrorHandler("Password is not defined in the database", 500)
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      return next(new ErrorHandler("JWT secret is not defined", 500));
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id , role : user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
    });

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 3600),
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      role: user.role,
      id: user._id,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

router.get(
  "/get-user",
  verifyToken,
  catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id, "-password");

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  })
);

router.put(
  "/update-user",
  verifyToken,
  catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  })
);

// Route to get all orders for a specific user
router.get("/:userId/orders", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find orders where the user ID matches the specified userId
    const orders = await order.find({ user: userId }).populate({
      path: "orderItems.product",
      select: "productName discountedProductPrice", // Only select the productName and discountedProductPrice fields
    });

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
});

// log out user
router.post(
  "/logout",
  verifyToken,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// Create Order and Handle Payment
router.post("/:userId/create-order", async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
    
    shippingCharges,
    discountOnOrder,
    modeOfPayment,
  } = req.body;
  const { userId } = req.params;

  try {
    let newOrder;

    if (modeOfPayment === "Online Delivery") {
      // Create order with Razorpay
      const options = {
        amount: totalPrice, // amount in smallest currency unit
        currency: "INR",
      };

      const razorpayOrder = await instance.orders.create(options);

      if (!razorpayOrder) {
        return res
          .status(500)
          .json({ error: "Failed to create Razorpay order" });
      }

      // Create order in the database
      newOrder = await order.create({
        shippingInfo,
        orderItems,
        totalPrice,
        totalPriceAfterDiscount,
        paymentInfo: { ...paymentInfo, razorpayOrderId: razorpayOrder.id },
      
        shippingCharges,
        discountOnOrder,
        modeOfPayment,
        user: userId,
      });

      if (newOrder) {
        // Update product stock and vendor balance
        for (const item of orderItems) {
          const productId = item.product;
          const quantity = item.quantity;

          await product.findByIdAndUpdate(productId, {
            $inc: { productStock: -quantity },
          });
        }

        // Increase vendor balance
        const vendorIds = [...new Set(orderItems.map((item) => item.vendor))];
        for (const vendorId of vendorIds) {
          await vendor.findByIdAndUpdate(vendorId, {
            $push: { orders: newOrder._id },
            $inc: { balance: totalPriceAfterDiscount || totalPrice },
          });
        }
      }

      res.json({
        success: true,
        razorpayOrder,
      });
    } else {
      // Handle other payment methods (e.g., Cash on Delivery)
      newOrder = await order.create({
        shippingInfo,
        orderItems,
        totalPrice,
        totalPriceAfterDiscount,
        paymentInfo,
        shippingCharges,
        discountOnOrder,
        modeOfPayment,
        user: userId,
      });

      if (newOrder) {
        // Update product stock and vendor balance
        for (const item of orderItems) {
          const productId = item.product;
          const quantity = item.quantity;

          await product.findByIdAndUpdate(productId, {
            $inc: { productStock: -quantity },
          });
        }

        // Increase vendor balance
        const vendorIds = [...new Set(orderItems.map((item) => item.vendor))];
        for (const vendorId of vendorIds) {
          await vendor.findByIdAndUpdate(vendorId, {
            $push: { orders: newOrder._id },
            $inc: { balance: totalPriceAfterDiscount || totalPrice },
          });
        }
      }

      res.json({
        success: true,
        newOrder,
      });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});


// Verify Payment
router.post("/paymentVerification", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Store payment details in database
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(`http://localhost:3000/paymentsuccess`);
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// Get Razorpay Key
router.get("/key", (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_API_KEY,
  });
});

module.exports = router;
