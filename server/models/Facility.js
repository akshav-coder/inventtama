const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["cold_storage", "direct_use"],
    required: true,
  },
});

module.exports = mongoose.model("Facility", facilitySchema);
