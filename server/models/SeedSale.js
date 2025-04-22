const mongoose = require("mongoose");

const seedSaleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    quantitySold: {
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
    buyerName: {
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

module.exports = mongoose.model("SeedSale", seedSaleSchema);
