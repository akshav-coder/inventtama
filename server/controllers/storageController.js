const Storage = require("../models/Storage");

// @desc Create storage movement
exports.createStorageEntry = async (req, res) => {
  try {
    const storage = new Storage(req.body);
    const saved = await storage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all storage logs
exports.getStorageEntries = async (req, res) => {
  try {
    const entries = await Storage.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get single entry
exports.getStorageById = async (req, res) => {
  try {
    const entry = await Storage.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not Found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update entry
exports.updateStorageEntry = async (req, res) => {
  try {
    const updated = await Storage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete entry
exports.deleteStorageEntry = async (req, res) => {
  try {
    await Storage.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
