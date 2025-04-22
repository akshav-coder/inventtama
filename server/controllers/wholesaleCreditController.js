const WholesaleCredit = require("../models/WholesaleCredit");

// @desc Add or update credit entry
exports.createOrUpdateCredit = async (req, res) => {
  try {
    const existing = await WholesaleCredit.findOne({
      buyerName: req.body.buyerName,
    });
    if (existing) {
      const updated = await WholesaleCredit.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } else {
      const newEntry = new WholesaleCredit(req.body);
      const saved = await newEntry.save();
      res.status(201).json(saved);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Get all credit entries
exports.getAllCredits = async (req, res) => {
  try {
    const credits = await WholesaleCredit.find().sort({ buyerName: 1 });
    res.json(credits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get single buyer
exports.getCreditByBuyer = async (req, res) => {
  try {
    const credit = await WholesaleCredit.findOne({
      buyerName: req.params.buyerName,
    });
    if (!credit) return res.status(404).json({ message: "Not Found" });
    res.json(credit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete entry
exports.deleteCreditEntry = async (req, res) => {
  try {
    await WholesaleCredit.findByIdAndDelete(req.params.id);
    res.json({ message: "Wholesale credit record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
