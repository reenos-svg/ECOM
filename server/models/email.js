// models/email.js
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("Email", emailSchema);