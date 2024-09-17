const mongoose = require("mongoose");
const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    prodcuts: [
      {
        productId: {
          type: String,
        },
        quantity : {
            type : Number,
            default : 1,
        },

      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
