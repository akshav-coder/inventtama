const SeedSale = require("../models/SeedSale");

// @desc Create seed sale
exports.createSeedSale = async (req, res) => {
  try {
    const sale = new SeedSale(req.body);
    const saved = await sale.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all seed sales
exports.getAllSeedSales = async (req, res) => {
  try {
    const sales = await SeedSale.find().sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get sale by ID
exports.getSeedSaleById = async (req, res) => {
  try {
    const sale = await SeedSale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: "Not Found" });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update sale
exports.updateSeedSale = async (req, res) => {
  try {
    const updated = await SeedSale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete sale
exports.deleteSeedSale = async (req, res) => {
  try {
    await SeedSale.findByIdAndDelete(req.params.id);
    res.json({ message: "Seed sale deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
