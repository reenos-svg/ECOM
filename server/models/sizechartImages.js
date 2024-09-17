const mongoose = require("mongoose");

const sizeChartImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false, // Only one size chart image can be active at a time
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SizeChartImage", sizeChartImageSchema);
