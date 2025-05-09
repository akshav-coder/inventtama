const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    invoice_no: {
      type: String,
      required: true,
    },
    tamarindType: {
      type: String,
      enum: ["Whole", "Raw Pod"],
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
    remainingBalance: {
      type: Number,
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

module.exports = mongoose.model("Purchase", purchaseSchema);
