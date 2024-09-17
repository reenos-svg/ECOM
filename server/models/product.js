const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    productSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    productColors: [
      {
        colorName: { type: String, required: true },
        colorCode: { type: String, required: true },
        imageUrl: { type: String }, // Image for the specific color
      },
    ],
    productSize: {
      type: [String], // Changed to an array to match the provided details
      required: true,
    },
    productColor: {
      type: [String], // Changed to an array to match the provided details
      required: true,
    },
    productImages: {
      type: [String],
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    discountedProductPrice: {
      type: Number,
      required: true,
    },
    productStock: {
      type: Number,
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // Reference to Vendor model
      required: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    productTheme: {
      type: String,
      default: null,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
