const mongoose = require("mongoose");

const carouselImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarouselImage", carouselImageSchema);
