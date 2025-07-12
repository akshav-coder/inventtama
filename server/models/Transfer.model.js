const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    transferDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    fromStorageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    toStorageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    tamarindType: {
      type: String,
      required: true,
      enum: ["Whole", "Raw Pod", "Paste"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    remarks: {
      type: String,
      trim: true,
    },
    lotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lot",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add index for better query performance
transferSchema.index({ createdAt: -1 });

// Virtual for total amount (if needed for future use)
transferSchema.virtual("totalAmount").get(function () {
  return this.quantity;
});

const Transfer = mongoose.model("Transfer", transferSchema);
module.exports = Transfer;
