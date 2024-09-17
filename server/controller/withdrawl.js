const express = require("express");
const router = express.Router();
const { isVendor } = require("../middleware/auth");
const mongoose = require("mongoose");
const withdrawls = require("../models/withdrawls");
const vendor = require("../models/vendor");

// Middleware to get withdrawal by ID
async function getWithdrawal(req, res, next) {
  let withdrawal;
  try {
    withdrawal = await withdrawls
      .findById(req.params.id)
      .populate("vendor", "name");
    if (withdrawal == null) {
      return res.status(404).json({ message: "Cannot find withdrawal" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.withdrawal = withdrawal;
  next();
}

// Get all withdrawals
router.get("/withdrawals", async (req, res) => {
  try {
    const withdrawals = await withdrawls.find().populate("vendor", "name");
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new withdrawal
router.post("/new-withdrawal", isVendor, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vendorDetails = await vendor.findById(req.vendor.id).session(session);
    if (!vendorDetails) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (req.body.amount > vendorDetails.balance) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    vendorDetails.balance -= req.body.amount;

    const withdrawal = new withdrawls({
      vendor: vendorDetails._id,
      amount: req.body.amount,
      accountHolderName: req.body.accountHolderName,
      accountNumber: req.body.accountNumber,
      branchName: req.body.branchName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      closingBalance: vendorDetails.balance,
    });

    const newWithdrawal = await withdrawal.save({ session });
    await vendorDetails.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      newWithdrawal,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
});

// Route to get all withdrawals by vendor ID
router.get("/withdraw/vendor", isVendor, async (req, res) => {
  const vendorId = req.vendor.id;

  try {
    const withdrawals = await withdrawls
      .find({ vendor: vendorId })
      .populate("vendor", "name");
    if (!withdrawals.length) {
      return res
        .status(404)
        .json({ message: "No withdrawals found for this vendor" });
    }

    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a withdrawal
router.put("/:id", getWithdrawal, async (req, res) => {
  if (req.body.vendorId != null) {
    res.withdrawal.vendor = req.body.vendorId;
  }

  if (req.body.status != null) {
    res.withdrawal.status = req.body.status;
  }

  try {
    const updatedWithdrawal = await res.withdrawal.save();
    res.json(updatedWithdrawal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a withdrawal
router.delete("/:id", getWithdrawal, async (req, res) => {
  try {
    const id = req.params.id;
    const withdraw = await withdrawls.findByIdAndDelete(id);
    if (!withdraw) {
      res.status(200).json({ message: "Withdrawal Request doesn't exsist" });
    }
    res
      .status(200)
      .json({ message: "Withdrawal Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
