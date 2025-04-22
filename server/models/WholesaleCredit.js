const mongoose = require("mongoose");

const wholesaleCreditSchema = new mongoose.Schema(
  {
    buyerName: {
      type: String,
      required: true,
    },
    lastPurchaseDate: {
      type: Date,
      required: true,
    },
    totalCreditGiven: {
      type: Number,
      required: true,
    },
    totalAmountPaid: {
      type: Number,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
    paymentHistory: [
      {
        date: Date,
        amount: Number,
        note: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WholesaleCredit", wholesaleCreditSchema);
