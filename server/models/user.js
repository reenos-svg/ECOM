const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name!"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unqiue: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [4, "Password should be greater than 4 characters"],
    },
    phoneNumber: {
      type: Number,
    },
    address: [
      {
        street: {
          type: String,
        },
        country: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        zipCode: {
          type: Number,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
