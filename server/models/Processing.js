const mongoose = require("mongoose");

const processingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    manufacturingUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Storage",
      required: true,
    },
    inputs: [
      {
        tamarindType: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalInputQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    output: {
      pasteType: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    weightLoss: {
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    team: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate total input quantity
processingSchema.pre("save", function (next) {
  this.totalInputQuantity = this.inputs.reduce(
    (sum, input) => sum + input.quantity,
    0
  );
  next();
});

// Pre-save middleware to calculate weight loss
processingSchema.pre("save", function (next) {
  this.weightLoss.quantity = this.totalInputQuantity - this.output.quantity;
  this.weightLoss.percentage =
    (this.weightLoss.quantity / this.totalInputQuantity) * 100;
  next();
});

const Processing = mongoose.model("Processing", processingSchema);

module.exports = Processing;
