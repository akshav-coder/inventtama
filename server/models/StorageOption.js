const mongoose = require("mongoose");

const StorageOptionSchema = new mongoose.Schema({
  option: { type: String, required: true },
});

module.exports = mongoose.model("StorageOption", StorageOptionSchema);
