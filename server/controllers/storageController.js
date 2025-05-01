const Storage = require("../models/Storage");
const StorageOption = require("../models/StorageOption");

exports.addStorageOption = async (req, res) => {
  const { option } = req.body;

  if (!option) {
    return res.status(400).json({ message: "Storage option is required." });
  }

  try {
    const newOption = new StorageOption({ option });
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    res.status(500).json({ message: "Error adding storage option." });
  }
};
