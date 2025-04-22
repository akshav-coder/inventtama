const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    tamarindType: {
      type: String,
      enum: ["Whole", "Raw Pod"],
      required: true,
    },
    quantityIn: {
      type: Number,
      default: 0,
    },
    quantityOut: {
      type: Number,
      default: 0,
    },
    reasonForMovement: {
      type: String,
      enum: ["To Unit 1", "To Unit 2", "Store"],
      required: true,
    },
    storageLocation: {
      type: String,
      default: "Cold Storage 1",
    },
    remainingStock: {
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

module.exports = mongoose.model("Storage", storageSchema);
