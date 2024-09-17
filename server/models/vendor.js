const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  name: {
    type: String,
    required: [true, "Please enter your vendor name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your vendor email!"],
    unique: true, // Ensure unique email addresses for vendors
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [4, "Password should be greater than 4 characters"],
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Please enter your address!"],
  },
  role: {
    type: String,
    default: "vendor",
  },
  zipcode: {
    type: Number,
    required: [true, "Please enter your zipcode!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Vendor", vendorSchema);
