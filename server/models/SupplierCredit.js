const mongoose = require("mongoose");

const supplierCreditSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    totalPurchases: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    remainingBalance: {
      type: Number,
      required: true,
    },
    lastPaymentDate: {
      type: Date,
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

module.exports = mongoose.model("SupplierCredit", supplierCreditSchema);
