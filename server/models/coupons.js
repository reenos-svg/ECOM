const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: String,
  discountAmount: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  minOrderAmount: { type: Number, default: 0 },
  validCategories: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
