const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
    },
    location: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    alternateNumber: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    outstandingBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", SupplierSchema);
module.exports = Supplier;
