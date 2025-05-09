const mongoose = require("mongoose");

const storeEntrySchema = new mongoose.Schema({
  purchase_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
    required: true,
  },
  facility_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  materialType: {
    type: String,
    enum: ["puli_type_1", "puli_type_2"],
    required: true,
  },
  lot_number: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("StoreEntry", storeEntrySchema);
