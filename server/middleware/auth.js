const User = require("../models/user");
const Vendor = require("../models/vendor");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");

exports.verifyToken = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Log detailed error
      return next(new ErrorHandler("Invalid Token", 400));
    }
    try {
      const user = await User.findById(decoded.id, "-password");
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error fetching user:", error); // Log detailed error
      return next(new ErrorHandler("Error fetching user", 500));
    }
  });
});

exports.isVendor = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Log detailed error
      return next(new ErrorHandler("Invalid Token", 400));
    }
    try {
      const vendor = await Vendor.findById(decoded.id, "-password");

      if (!vendor) {
        return next(new ErrorHandler("Vendor doesn't exist", 400));
      }

      if (vendor.role !== "admin" && vendor.role !== "vendor") {
        return next(new ErrorHandler("Access denied", 403));
      }

      req.vendor = vendor;
      next();
    } catch (error) {
      console.error("Error fetching user:", error); // Log detailed error
      return next(new ErrorHandler("Error fetching user", 500));
    }
  });
});

exports.isAdmin = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Log detailed error
      return next(new ErrorHandler("Invalid Token", 400));
    }
    try {
      const vendor = await Vendor.findById(decoded.id, "-password");

      if (!vendor) {
        return next(new ErrorHandler("Admin doesn't exist", 400));
      }

      if (vendor.role !== "admin") {
        return next(new ErrorHandler("Access denied", 403));
      }

      req.vendor = vendor;
      next();
    } catch (error) {
      console.error("Error fetching user:", error); // Log detailed error
      return next(new ErrorHandler("Error fetching user", 500));
    }
  });
});
