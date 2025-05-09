const mongoose = require("mongoose");

const lotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  facility_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
});

module.exports = mongoose.model("Lot", lotSchema);
