const mongoose = require("mongoose");

const supplierPaymentSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      // allow credit entries generated from purchases
      enum: ["cash", "bank", "upi", "credit"],
      required: true,
    },
    upiTransactionId: String,
    upiScreenshot: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierPayment", supplierPaymentSchema);
