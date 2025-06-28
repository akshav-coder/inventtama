const Purchase = require("../models/Purchase");
const Storage = require("../models/Storage");
const Lot = require("../models/Lot");

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplierId")
      .populate("tamarindItems.allocation.storageId")
      .populate("tamarindItems.allocation.lotId");
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplierId")
      .populate("tamarindItems.allocation.storageId")
      .populate("tamarindItems.allocation.lotId");
    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const data = req.body;
    const purchase = new Purchase(data);
    await purchase.save();

    for (const item of data.tamarindItems) {
      for (const allocation of item.allocation) {
        const storage = await Storage.findById(allocation.storageId);
        if (storage.type === "cold") {
          let lot = null;
          if (allocation.lotNumber) {
            lot = await Lot.findOne({
              lotNumber: allocation.lotNumber,
              coldStorageId: allocation.storageId,
              tamarindType: item.type,
              isActive: true,
            });
          }
          if (!lot) {
            lot = await Lot.create({
              lotNumber: allocation.lotNumber,
              coldStorageId: allocation.storageId,
              tamarindType: item.type,
              quantity: allocation.quantity,
              isActive: true,
              purchaseId: purchase._id,
            });
          } else {
            lot.quantity += allocation.quantity;
            await lot.save();
          }
          allocation.lotId = lot._id;
        }
        delete allocation.lotNumber;
      }
    }
    purchase.tamarindItems = data.tamarindItems;
    await purchase.save();

    // if purchase was on credit, create a matching supplier payment entry
    if (purchase.paymentType === "credit") {
      const Supplier = require("../models/Supplier");
      const SupplierPayment = require("../models/SupplierPayment");
      const supplier = await Supplier.findById(purchase.supplierId);
      if (supplier) {
        supplier.outstandingBalance =
          (supplier.outstandingBalance || 0) + (purchase.totalAmount || 0);
        await supplier.save();
      }
      await SupplierPayment.create({
        supplier: purchase.supplierId,
        amount: purchase.totalAmount || 0,
        paymentDate: purchase.purchaseDate,
        paymentMode: "credit",
        notes: `Credit purchase ${purchase.invoiceNumber}`,
      });
    }

    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create purchase",
      details: error.message,
    });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const purchaseId = req.params.id;
    const newData = req.body;
    const existingPurchase = await Purchase.findById(purchaseId);
    if (!existingPurchase)
      return res.status(404).json({ error: "Purchase not found" });
    for (const item of existingPurchase.tamarindItems) {
      for (const allocation of item.allocation) {
        const storage = await Storage.findById(allocation.storageId);
        if (storage.type === "cold" && allocation.lotId) {
          const lot = await Lot.findById(allocation.lotId);
          if (lot) {
            lot.quantity -= allocation.quantity;
            await lot.save();
          }
        }
      }
    }
    for (const item of newData.tamarindItems) {
      for (const allocation of item.allocation) {
        const storage = await Storage.findById(allocation.storageId);
        if (storage.type === "cold") {
          let lot = null;
          if (allocation.lotNumber) {
            lot = await Lot.findOne({
              lotNumber: allocation.lotNumber,
              coldStorageId: allocation.storageId,
              tamarindType: item.type,
              isActive: true,
            });
          }
          if (!lot) {
            lot = await Lot.create({
              lotNumber: allocation.lotNumber,
              coldStorageId: allocation.storageId,
              tamarindType: item.type,
              quantity: allocation.quantity,
              isActive: true,
              purchaseId: purchaseId,
            });
          } else {
            lot.quantity += allocation.quantity;
            await lot.save();
          }
          allocation.lotId = lot._id;
        }
        delete allocation.lotNumber;
      }
    }
    existingPurchase.set(newData);
    await existingPurchase.save();
    res.status(200).json(existingPurchase);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update purchase",
      details: error.message,
    });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
