const Supplier = require("../models/Supplier");

exports.addSupplier = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Supplier name is required" });

    const newSupplier = new Supplier({ name });
    await newSupplier.save();

    res
      .status(201)
      .json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding supplier", error: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("_id name");
    res.status(200).json(suppliers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching suppliers", error: error.message });
  }
};
