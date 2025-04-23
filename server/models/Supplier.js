const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
