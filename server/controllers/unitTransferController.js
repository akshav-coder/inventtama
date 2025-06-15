const Transfer = require("../models/Transfer.model");

// @desc Create a unit transfer
exports.createTransfer = async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    const saved = await transfer.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find()
      .populate("fromStorageId", "name")
      .populate("toStorageId", "name")
      .populate("lotId", "lotNumber")
      .sort({ transferDate: -1 });
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get single transfer
exports.getTransferById = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate("fromStorageId", "name")
      .populate("toStorageId", "name")
      .populate("lotId", "lotNumber");
    if (!transfer) return res.status(404).json({ message: "Not Found" });
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update transfer
exports.updateTransfer = async (req, res) => {
  try {
    const updated = await Transfer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("fromStorageId", "name")
      .populate("toStorageId", "name")
      .populate("lotId", "lotNumber");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete transfer
exports.deleteTransfer = async (req, res) => {
  try {
    await Transfer.findByIdAndDelete(req.params.id);
    res.json({ message: "Transfer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
