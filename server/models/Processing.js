const mongoose = require("mongoose");

const processingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    unitName: {
      type: String,
      enum: ["Unit 1", "Unit 2"],
      required: true,
    },
    tamarindTypeUsed: {
      type: String,
      enum: ["Whole", "Raw Pod"],
      required: true,
    },
    quantityUsed: {
      type: Number,
      required: true,
    },
    saltQty: {
      type: Number,
      default: 0,
    },
    oilQty: {
      type: Number,
      default: 0,
    },
    pasteProduced: {
      type: Number,
      required: true,
    },
    seedsCollected: {
      type: Number,
      default: 0,
    },
    operatorName: {
      type: String,
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

module.exports = mongoose.model("Processing", processingSchema);
