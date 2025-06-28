const Purchase = require("../models/Purchase");
const Sale = require("../models/Sale");
const Transfer = require("../models/Transfer.model");
const Processing = require("../models/Processing");
const SupplierPayment = require("../models/SupplierPayment");
const CustomerReceipt = require("../models/CustomerReceipt");
const Supplier = require("../models/Supplier");
const Customer = require("../models/Customer");
const Storage = require("../models/Storage");
const Lot = require("../models/Lot");

const parseDateRange = (start, end, field = "createdAt") => {
  const match = {};
  if (start && end) {
    match[field] = { $gte: new Date(start), $lte: new Date(end) };
  }
  return match;
};

// Purchase report grouped by supplier
exports.purchases = async (req, res) => {
  try {
    const { startDate, endDate, supplier, paymentType } = req.query;
    const match = { ...parseDateRange(startDate, endDate, "purchaseDate") };
    if (supplier) match.supplierId = supplier;
    if (paymentType) match.paymentType = paymentType;

    const data = await Purchase.aggregate([
      { $match: match },
      { $unwind: "$tamarindItems" },
      {
        $group: {
          _id: "$supplierId",
          totalQuantity: { $sum: "$tamarindItems.quantity" },
          totalAmount: { $sum: "$tamarindItems.totalAmount" },
        },
      },
      { $lookup: { from: "suppliers", localField: "_id", foreignField: "_id", as: "supplier" } },
      { $unwind: "$supplier" },
      {
        $project: {
          supplierId: "$_id",
          supplierName: "$supplier.name",
          totalQuantity: 1,
          totalAmount: 1,
          outstanding: "$supplier.outstandingBalance",
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sales report grouped by customer
exports.sales = async (req, res) => {
  try {
    const { startDate, endDate, customer, paymentType } = req.query;
    const match = { ...parseDateRange(startDate, endDate, "invoiceDate") };
    if (customer) match.customer = customer;
    if (paymentType) match.paymentType = paymentType;

    const data = await Sale.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$customer",
          quantity: { $sum: "$items.quantity" },
          value: { $sum: "$items.total" },
        },
      },
      { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
      { $unwind: "$customer" },
      {
        $project: {
          customerId: "$_id",
          customerName: "$customer.name",
          quantity: 1,
          value: 1,
          outstanding: "$customer.outstandingBalance",
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Transfer report summarised by source and destination
exports.transfers = async (req, res) => {
  try {
    const { startDate, endDate, fromStorage, toStorage } = req.query;
    const match = { ...parseDateRange(startDate, endDate, "transferDate") };
    if (fromStorage) match.fromStorageId = fromStorage;
    if (toStorage) match.toStorageId = toStorage;

    const data = await Transfer.aggregate([
      { $match: match },
      {
        $group: {
          _id: { from: "$fromStorageId", to: "$toStorageId", type: "$tamarindType" },
          quantity: { $sum: "$quantity" },
        },
      },
      { $lookup: { from: "storages", localField: "_id.from", foreignField: "_id", as: "from" } },
      { $unwind: "$from" },
      { $lookup: { from: "storages", localField: "_id.to", foreignField: "_id", as: "to" } },
      { $unwind: "$to" },
      {
        $project: {
          fromStorage: "$from.name",
          toStorage: "$to.name",
          tamarindType: "$_id.type",
          quantity: 1,
        },
      },
      { $sort: { fromStorage: 1, toStorage: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Processing efficiency per manufacturing unit
exports.processing = async (req, res) => {
  try {
    const { startDate, endDate, unit } = req.query;
    const match = { ...parseDateRange(startDate, endDate, "date") };
    if (unit) match.manufacturingUnit = unit;

    const data = await Processing.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$manufacturingUnit",
          totalInput: { $sum: "$totalInputQuantity" },
          totalOutput: { $sum: "$output.quantity" },
          totalWeightLoss: { $sum: "$weightLoss.quantity" },
        },
      },
      { $lookup: { from: "storages", localField: "_id", foreignField: "_id", as: "unit" } },
      { $unwind: "$unit" },
      {
        $project: {
          unitId: "$_id",
          unitName: "$unit.name",
          totalInput: 1,
          totalOutput: 1,
          totalWeightLoss: 1,
          efficiency: {
            $cond: [
              { $eq: ["$totalInput", 0] },
              0,
              { $divide: ["$totalOutput", "$totalInput"] },
            ],
          },
        },
      },
      { $sort: { unitName: 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Current stock levels per storage
exports.stock = async (req, res) => {
  try {
    const { storageId, tamarindType } = req.query;
    const storageMatch = storageId ? { _id: storageId } : {};

    const storages = await Storage.find(storageMatch);
    const lotMatch = { isActive: true };
    if (storageId) lotMatch.coldStorageId = storageId;
    if (tamarindType) lotMatch.tamarindType = tamarindType;

    const lots = await Lot.aggregate([
      { $match: lotMatch },
      {
        $group: {
          _id: { storage: "$coldStorageId", type: "$tamarindType" },
          quantity: { $sum: "$quantity" },
        },
      },
    ]);

    const coldMap = {};
    lots.forEach((l) => {
      const sid = l._id.storage.toString();
      if (!coldMap[sid]) coldMap[sid] = {};
      coldMap[sid][l._id.type] = l.quantity;
    });

    const result = storages.map((s) => ({
      storageId: s._id,
      storageName: s.name,
      type: s.type,
      quantity: s.quantity,
      lots: coldMap[s._id.toString()] || {},
    }));

    const total = result.reduce((sum, r) => {
      if (r.type === "cold") {
        return sum + Object.values(r.lots).reduce((a, b) => a + b, 0);
      }
      return sum + (r.quantity || 0);
    }, 0);

    res.json({ total, storages: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supplier payments or customer receipts summary
exports.payments = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query; // type: supplier or customer
    const match = parseDateRange(startDate, endDate, "paymentDate");

    if (type === "supplier") {
      const data = await SupplierPayment.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$supplier",
            totalPaid: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $lookup: { from: "suppliers", localField: "_id", foreignField: "_id", as: "supplier" } },
        { $unwind: "$supplier" },
        {
          $project: {
            supplierId: "$_id",
            supplierName: "$supplier.name",
            totalPaid: 1,
            payments: "$count",
            outstanding: "$supplier.outstandingBalance",
          },
        },
        { $sort: { supplierName: 1 } },
      ]);
      res.json(data);
    } else {
      const data = await CustomerReceipt.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$customer",
            totalReceived: { $sum: "$totalAmount" },
            count: { $sum: 1 },
          },
        },
        { $lookup: { from: "customers", localField: "_id", foreignField: "_id", as: "customer" } },
        { $unwind: "$customer" },
        {
          $project: {
            customerId: "$_id",
            customerName: "$customer.name",
            totalReceived: 1,
            receipts: "$count",
            outstanding: "$customer.outstandingBalance",
          },
        },
        { $sort: { customerName: 1 } },
      ]);
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
