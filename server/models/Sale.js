const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerType: {
      type: String,
      enum: ["Wholesale", "Retail"],
      required: true,
    },
    productSold: {
      type: String,
      enum: ["Paste"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    remainingBalance: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "Credit"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", saleSchema);
