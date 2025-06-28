const mongoose = require("mongoose");

const receiptItemSchema = new mongoose.Schema(
  {
    sale: { type: mongoose.Schema.Types.ObjectId, ref: "Sale", required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const customerReceiptSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    invoices: { type: [receiptItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    receiptNumber: { type: String, unique: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "bank", "cheque"],
      required: true,
    },
    referenceNo: String,
    isDeleted: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

customerReceiptSchema.pre("save", function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber = `RCPT-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("CustomerReceipt", customerReceiptSchema);
