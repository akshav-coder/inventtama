const Lot = require("../models/Lot");

exports.getLotsByFacility = async (req, res) => {
  try {
    const { coldStorageId } = req.query;
    const filter = coldStorageId ? { coldStorageId } : {};
    const lots = await Lot.find(filter).populate("coldStorageId");
    res.status(200).json(lots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lots" });
  }
};

exports.createLot = async (req, res) => {
  try {
    const newLot = new Lot(req.body);
    const saved = await newLot.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create lot",
      details: error.message,
    });
  }
};

exports.updateLot = async (req, res) => {
  try {
    const updated = await Lot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Lot not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update lot",
      details: error.message,
    });
  }
};
