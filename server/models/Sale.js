const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    pasteType: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    invoiceDate: { type: Date, required: true, default: Date.now },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: { type: [itemSchema], required: true },
    paymentType: { type: String, enum: ["cash", "credit"], required: true },
    dueDate: { type: Date },
    amountPaid: { type: Number, default: 0 },
    notes: { type: String },
    totalAmount: { type: Number },
  },
  { timestamps: true }
);

saleSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((sum, i) => sum + i.total, 0);
  next();
});

module.exports = mongoose.model("Sale", saleSchema);
