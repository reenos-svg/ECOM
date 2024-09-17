const catchAsyncError = require("../middleware/catchAsyncError");
const order = require("../models/order");
const express = require("express");
const router = express.Router();
const { isVendor } = require("../middleware/auth");
const { default: mongoose } = require("mongoose");

// Utility function to get the last 6 months
const getLastSixMonths = () => {
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    months.push({
      year: monthDate.getFullYear(),
      month: monthDate.getMonth() + 1,
    });
  }

  return months.reverse();
};

// Route to get all orders, protected and role-based
router.get(
  "/orders",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await order.find({});
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  })
);

router.get(
  "/values/last-6-months",
  isVendor,
  catchAsyncError(async (req, res, next) => {
    try {
      const vendorId = req.vendor.id;
      const currentDate = new Date();
      const sixMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 5,
        1
      );

      const vendorObjectId = new mongoose.Types.ObjectId(vendorId);

      const orderValues = await order.aggregate([
        {
          $match: {
            "orderItems.vendor": vendorObjectId,
            createdAt: { $gte: sixMonthsAgo, $lte: currentDate },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalOrderValue: { $sum: "$totalPriceAfterDiscount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        {
          $project: {
            _id: 0,
            month: "$_id.month",
            year: "$_id.year",
            totalOrderValue: 1,
          },
        },
      ]);

      // Get the last six months
      const lastSixMonths = getLastSixMonths();

      // Merge aggregated results with the last six months, ensuring all months are included
      const formattedOrderValues = lastSixMonths.map((monthObj) => {
        const found = orderValues.find(
          (item) => item.month === monthObj.month && item.year === monthObj.year
        );
        return {
          month: monthObj.month,
          year: monthObj.year,
          totalOrderValue: found ? found.totalOrderValue : 0,
        };
      });

      res.status(200).json({
        success: true,
        orderValues: formattedOrderValues,
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
      next(error);
    }
  })
);

// Route to get the last 5 orders by vendor ID
router.get(
  "/:vendorId/recent-orders",
  catchAsyncError(async (req, res, next) => {
    try {
      const { vendorId } = req.params;

      if (!vendorId) {
        return res.status(400).json({
          success: false,
          message: "Vendor ID is required",
        });
      }

      const orders = await order
        .find({ "orderItems.vendor": vendorId })
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(5); // Limit the result to the last 5 orders

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  })
);

// Route to get order details by ID, protected and role-based
router.get(
  "/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const orderDetails = await order.findById(orderId).populate({
        path: "orderItems.product",
        select:
          "productName discountedProductPrice productImages productSubCategory productCategory", // Only select the productName field
        populate: [
          {
            path: "productCategory",
            select: "name", // Select the fields you need from the productCategory
          },
          {
            path: "productSubCategory",
            select: "name", // Select the fields you need from the productSubCategory
          },
        ],
      });

      if (!orderDetails) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        order: orderDetails,
      });
    } catch (error) {
      next(error);
    }
  })
);

// Route to update the order status by ID, protected and role-based
router.put(
  "/:id/status",
  catchAsyncError(async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const { orderStatus } = req.body;

      const updatedOrder = await order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        order: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  })
);

module.exports = router;
