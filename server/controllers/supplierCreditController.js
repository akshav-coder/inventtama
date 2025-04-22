const SupplierCredit = require("../models/SupplierCredit");

// @desc Add or update supplier credit
exports.createOrUpdateSupplierCredit = async (req, res) => {
  try {
    const existing = await SupplierCredit.findOne({
      supplierName: req.body.supplierName,
    });
    if (existing) {
      const updated = await SupplierCredit.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } else {
      const newEntry = new SupplierCredit(req.body);
      const saved = await newEntry.save();
      res.status(201).json(saved);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all suppliers
exports.getAllSupplierCredits = async (req, res) => {
  try {
    const suppliers = await SupplierCredit.find().sort({ supplierName: 1 });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get one supplier
exports.getSupplierCreditByName = async (req, res) => {
  try {
    const supplier = await SupplierCredit.findOne({
      supplierName: req.params.supplierName,
    });
    if (!supplier) return res.status(404).json({ message: "Not Found" });
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete supplier credit record
exports.deleteSupplierCredit = async (req, res) => {
  try {
    await SupplierCredit.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier credit record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
