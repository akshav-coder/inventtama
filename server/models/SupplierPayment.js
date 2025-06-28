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
      enum: ["cash", "bank", "upi"],
      required: true,
    },
    upiTransactionId: String,
    upiScreenshot: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierPayment", supplierPaymentSchema);
