const UnitTransfer = require("../models/UnitTransfer");

// @desc Create a unit transfer
exports.createTransfer = async (req, res) => {
  try {
    const transfer = new UnitTransfer(req.body);
    const saved = await transfer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await UnitTransfer.find().sort({ date: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get single transfer
exports.getTransferById = async (req, res) => {
  try {
    const transfer = await UnitTransfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ message: "Not Found" });
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update transfer
exports.updateTransfer = async (req, res) => {
  try {
    const updated = await UnitTransfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete transfer
exports.deleteTransfer = async (req, res) => {
  try {
    await UnitTransfer.findByIdAndDelete(req.params.id);
    res.json({ message: "Transfer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
