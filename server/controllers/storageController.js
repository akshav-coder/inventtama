const Storage = require("../models/Storage");

exports.getStorages = async (req, res) => {
  try {
    const { type } = req.query;
    const filters = type ? { type } : {};
    const storages = await Storage.find(filters);
    res.status(200).json(storages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch storages" });
  }
};

exports.createStorage = async (req, res) => {
  try {
    const newStorage = new Storage(req.body);
    // If type is unit and quantity is not provided, set to 0
    if (newStorage.type === "unit" && typeof newStorage.quantity !== "number") {
      newStorage.quantity = 0;
    }
    const saved = await newStorage.save();
    res.status(201).json(saved);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create storage", details: error.message });
  }
};
