const Purchase = require("../models/Purchase");
const StoreEntry = require("../models/StoreEntry");
const Lot = require("../models/Lot");

exports.createPurchase = async (req, res) => {
  const session = await Purchase.startSession();
  session.startTransaction();
  try {
    const { storageEntries, ...purchaseData } = req.body;

    const purchase = new Purchase(purchaseData);
    const savedPurchase = await purchase.save({ session });

    if (!Array.isArray(storageEntries) || storageEntries.length === 0) {
      throw new Error("Storage entries are required.");
    }

    for (const entry of storageEntries) {
      const { facility_id, weight, materialType, lot_number } = entry;

      if (!facility_id || !weight || !materialType) {
        throw new Error("Missing fields in storage entry.");
      }

      if (lot_number) {
        const existingLot = await Lot.findOne({
          name: lot_number,
          facility_id,
        });
        if (!existingLot) {
          const newLot = new Lot({ name: lot_number, facility_id });
          await newLot.save({ session });
        }
      }

      await StoreEntry.create(
        [
          {
            purchase_id: savedPurchase._id,
            facility_id,
            weight,
            materialType,
            lot_number: lot_number || null,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    res.status(201).json({
      message: "Purchase created with storage entries",
      purchase: savedPurchase,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// @desc Get all purchases
exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ date: -1 })
      .populate("supplier", "name"); // Populate supplier details with only the name field
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get a single purchase
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: "Not Found" });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Delete purchase
exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
