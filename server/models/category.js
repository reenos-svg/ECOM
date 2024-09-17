const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      set: (name) => name.toLowerCase(), // Convert name to lowercase before saving
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",

      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
