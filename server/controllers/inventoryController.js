const Inventory = require("../models/Inventory");

// @desc Create inventory record
exports.createInventory = async (req, res) => {
  try {
    const inventory = new Inventory(req.body);
    const saved = await inventory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all inventory logs
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().sort({ date: -1 });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get one by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inv = await Inventory.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: "Not Found" });
    res.json(inv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update record
exports.updateInventory = async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete record
exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Inventory record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
