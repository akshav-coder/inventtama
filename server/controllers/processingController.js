const Processing = require("../models/Processing");

// @desc Create a processing log
exports.createProcessing = async (req, res) => {
  try {
    const process = new Processing(req.body);
    const saved = await process.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all processing logs
exports.getAllProcessing = async (req, res) => {
  try {
    const logs = await Processing.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get one by ID
exports.getProcessingById = async (req, res) => {
  try {
    const log = await Processing.findById(req.params.id);
    if (!log) return res.status(404).json({ message: "Not Found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update
exports.updateProcessing = async (req, res) => {
  try {
    const updated = await Processing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete
exports.deleteProcessing = async (req, res) => {
  try {
    await Processing.findByIdAndDelete(req.params.id);
    res.json({ message: "Processing log deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
