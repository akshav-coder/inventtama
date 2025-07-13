// routes/transfer.routes.js
const express = require("express");
const router = express.Router();
const Transfer = require("../models/Transfer.model");
const Lot = require("../models/Lot");
const Storage = require("../models/Storage");

// GET all transfers with filters
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, fromStorage, toStorage, tamarindType } =
      req.query;

    const query = {};

    if (startDate && endDate) {
      query.transferDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (fromStorage) query.fromStorageId = fromStorage;
    if (toStorage) query.toStorageId = toStorage;
    if (tamarindType) query.tamarindType = tamarindType;

    const transfers = await Transfer.find(query)
      .populate("fromStorageId", "name type")
      .populate("toStorageId", "name type")
      .populate("lotId", "lotNumber quantity")
      .populate({ path: "createdBy", select: "name", strictPopulate: false })
      .populate({ path: "updatedBy", select: "name", strictPopulate: false })
      .sort({ createdAt: -1 });

    res.status(200).json(transfers);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch transfers", details: err.message });
  }
});

// GET single transfer
router.get("/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id)
      .populate("fromStorageId", "name type")
      .populate("toStorageId", "name type")
      .populate("lotId", "lotNumber quantity")
      .populate({ path: "createdBy", select: "name", strictPopulate: false })
      .populate({ path: "updatedBy", select: "name", strictPopulate: false });

    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    res.status(200).json(transfer);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch transfer", details: err.message });
  }
});

// POST create a transfer
router.post("/", async (req, res) => {
  try {
    const {
      transferDate,
      fromStorageId,
      toStorageId,
      tamarindType,
      quantity,
      remarks,
      lotId,
    } = req.body;

    // Validate storage locations
    const [fromStorage, toStorage] = await Promise.all([
      Storage.findById(fromStorageId),
      Storage.findById(toStorageId),
    ]);

    if (!fromStorage || !toStorage) {
      return res.status(400).json({ error: "Invalid storage locations" });
    }

    // Validate lot if provided
    if (lotId) {
      const lot = await Lot.findById(lotId);
      if (!lot) {
        return res.status(400).json({ error: "Invalid lot" });
      }
      if (lot.quantity < quantity) {
        return res.status(400).json({ error: "Insufficient lot quantity" });
      }
    }

    const transfer = new Transfer({
      transferDate: transferDate || new Date(),
      fromStorageId,
      toStorageId,
      tamarindType,
      quantity,
      remarks,
      lotId,
    });

    await transfer.save();

    // Update lot quantity if it's a cold storage transfer
    if (lotId) {
      const lot = await Lot.findById(lotId);
      lot.quantity -= quantity;
      if (lot.quantity === 0) lot.isActive = false;
      await lot.save();
    }

    // Update unit storage quantity if transfer is to a unit storage
    if (toStorage.type === "unit") {
      toStorage.quantity = (toStorage.quantity || 0) + quantity;
      await toStorage.save();
    }

    // Decrease unit storage quantity if transfer is from a unit storage
    if (fromStorage.type === "unit") {
      fromStorage.quantity = Math.max(
        0,
        (fromStorage.quantity || 0) - quantity
      );
      await fromStorage.save();
    }

    // Populate the response
    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate("fromStorageId", "name type")
      .populate("toStorageId", "name type")
      .populate("lotId", "lotNumber quantity");

    res.status(201).json(populatedTransfer);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create transfer", details: err.message });
  }
});

// PUT update a transfer
router.put("/:id", async (req, res) => {
  try {
    const {
      transferDate,
      fromStorageId,
      toStorageId,
      tamarindType,
      quantity,
      remarks,
      lotId,
    } = req.body;

    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    // Validate storage locations
    const [fromStorage, toStorage] = await Promise.all([
      Storage.findById(fromStorageId),
      Storage.findById(toStorageId),
    ]);

    if (!fromStorage || !toStorage) {
      return res.status(400).json({ error: "Invalid storage locations" });
    }

    // Validate lot if provided
    if (lotId) {
      const lot = await Lot.findById(lotId);
      if (!lot) {
        return res.status(400).json({ error: "Invalid lot" });
      }
      if (lot.quantity < quantity) {
        return res.status(400).json({ error: "Insufficient lot quantity" });
      }
    }

    // Revert previous changes
    // Restore lot quantity if it was a cold storage transfer
    if (transfer.lotId) {
      const lot = await Lot.findById(transfer.lotId);
      if (lot) {
        lot.quantity += transfer.quantity;
        lot.isActive = true;
        await lot.save();
      }
    }

    // Revert unit storage quantity if transfer was to a unit storage
    const oldToStorage = await Storage.findById(transfer.toStorageId);
    if (oldToStorage && oldToStorage.type === "unit") {
      oldToStorage.quantity = Math.max(
        0,
        (oldToStorage.quantity || 0) - transfer.quantity
      );
      await oldToStorage.save();
    }

    // Apply new changes
    // Update lot quantity if it's a cold storage transfer
    if (lotId) {
      const lot = await Lot.findById(lotId);
      lot.quantity -= quantity;
      if (lot.quantity === 0) lot.isActive = false;
      await lot.save();
    }

    // Update unit storage quantity if transfer is to a unit storage
    if (toStorage.type === "unit") {
      toStorage.quantity = (toStorage.quantity || 0) + quantity;
      await toStorage.save();
    }

    // Update transfer
    const updatedTransfer = await Transfer.findByIdAndUpdate(
      req.params.id,
      {
        transferDate: transferDate || new Date(),
        fromStorageId,
        toStorageId,
        tamarindType,
        quantity,
        remarks,
        lotId,
      },
      { new: true }
    )
      .populate("fromStorageId", "name type")
      .populate("toStorageId", "name type")
      .populate("lotId", "lotNumber quantity");

    res.status(200).json(updatedTransfer);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to update transfer", details: err.message });
  }
});

// DELETE a transfer
router.delete("/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    // Restore lot quantity if it was a cold storage transfer
    if (transfer.lotId) {
      const lot = await Lot.findById(transfer.lotId);
      if (lot) {
        lot.quantity += transfer.quantity;
        lot.isActive = true;
        await lot.save();
      }
    }

    // Restore unit storage quantity if transfer was to a unit storage
    const toStorage = await Storage.findById(transfer.toStorageId);
    if (toStorage && toStorage.type === "unit") {
      toStorage.quantity = Math.max(
        0,
        (toStorage.quantity || 0) - transfer.quantity
      );
      await toStorage.save();
    }

    await Transfer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transfer deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete transfer", details: err.message });
  }
});

module.exports = router;
