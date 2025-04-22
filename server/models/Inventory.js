const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    item: {
      type: String,
      enum: ["Raw Tamarind", "Paste", "Salt", "Oil"],
      required: true,
    },
    openingStock: {
      type: Number,
      required: true,
    },
    stockIn: {
      type: Number,
      default: 0,
    },
    stockOut: {
      type: Number,
      default: 0,
    },
    closingStock: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
