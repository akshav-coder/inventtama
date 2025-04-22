const mongoose = require("mongoose");

const unitTransferSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    fromUnit: {
      type: String,
      required: true,
    },
    toUnit: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      enum: ["Raw Tamarind", "Paste", "Semi-processed"],
      required: true,
    },
    quantity: {
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

module.exports = mongoose.model("UnitTransfer", unitTransferSchema);
