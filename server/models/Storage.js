const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["cold", "unit"],
      required: true,
    },
    location: {
      type: String,
    },
    contactPerson: {
      type: String,
    },
    phone: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Storage = mongoose.model("Storage", storageSchema);
module.exports = Storage;
