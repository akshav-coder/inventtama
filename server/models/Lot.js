const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema(
  {
    lotNumber: {
      type: String,
      required: true,
    },
    coldStorageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    tamarindType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
  },
  {
    timestamps: true,
  }
);

const Lot = mongoose.model("Lot", lotSchema);
module.exports = Lot;
