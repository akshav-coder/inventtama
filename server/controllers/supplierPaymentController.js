const SupplierPayment = require("../models/SupplierPayment");
const Supplier = require("../models/Supplier");

exports.createPayment = async (req, res) => {
  try {
    const payment = new SupplierPayment(req.body);
    await payment.save();

    const supplier = await Supplier.findById(payment.supplier);
    if (supplier) {
      supplier.outstandingBalance =
        (supplier.outstandingBalance || 0) - payment.amount;
      await supplier.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: "Failed to create payment", details: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { supplier, startDate, endDate, mode } = req.query;
    const filter = {};
    if (supplier) filter.supplier = supplier;
    if (mode) filter.paymentMode = mode;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }
    const payments = await SupplierPayment.find(filter).populate("supplier");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await SupplierPayment.findById(req.params.id).populate("supplier");
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await SupplierPayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const oldAmount = payment.amount;
    const oldSupplier = payment.supplier.toString();

    payment.set(req.body);
    await payment.save();

    if (oldSupplier !== payment.supplier.toString()) {
      const prevSupplier = await Supplier.findById(oldSupplier);
      if (prevSupplier) {
        prevSupplier.outstandingBalance =
          (prevSupplier.outstandingBalance || 0) + oldAmount;
        await prevSupplier.save();
      }
      const newSupplier = await Supplier.findById(payment.supplier);
      if (newSupplier) {
        newSupplier.outstandingBalance =
          (newSupplier.outstandingBalance || 0) - payment.amount;
        await newSupplier.save();
      }
    } else if (oldAmount !== payment.amount) {
      const diff = payment.amount - oldAmount;
      const supplier = await Supplier.findById(payment.supplier);
      if (supplier) {
        supplier.outstandingBalance =
          (supplier.outstandingBalance || 0) - diff;
        await supplier.save();
      }
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: "Failed to update payment", details: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await SupplierPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const supplier = await Supplier.findById(payment.supplier);
    if (supplier) {
      supplier.outstandingBalance =
        (supplier.outstandingBalance || 0) + payment.amount;
      await supplier.save();
    }

    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
