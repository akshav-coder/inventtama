const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["retailer", "wholesaler", "end_user", "business"],
      required: true,
    },
    contactPerson: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    paymentMode: {
      type: String,
      enum: ["cash", "credit"],
      default: "cash",
    },
    preferredStorage: {
      type: String, // e.g., "Unit 1", "Unit 2"
    },
    customPricing: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
