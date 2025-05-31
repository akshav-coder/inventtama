// models/Purchase.model.js
const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    remarks: String,
    tamarindItems: [
      {
        type: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        rate: {
          type: Number,
          required: true,
        },
        allocation: [
          {
            storageId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Storage",
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            lotId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Lot",
            },
          },
        ],
        pricePerKg: {
          type: Number,
        },
        totalAmount: {
          type: Number,
        },
        notes: {
          type: String,
        },
      },
    ],
    paymentType: {
      type: String,
      enum: ["cash", "credit"],
      default: "credit",
    },
    totalAmount: Number,
  },
  {
    timestamps: true,
  }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
