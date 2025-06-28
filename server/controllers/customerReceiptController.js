const CustomerReceipt = require("../models/CustomerReceipt");
const Sale = require("../models/Sale");
const Customer = require("../models/Customer");

const applyPayment = async (saleId, amount) => {
  const sale = await Sale.findById(saleId);
  if (!sale) return { error: "Sale not found" };
  const outstanding = (sale.totalAmount || 0) - (sale.amountPaid || 0);
  if (amount > outstanding) {
    return { error: "Payment exceeds outstanding amount" };
  }
  sale.amountPaid = (sale.amountPaid || 0) + amount;
  await sale.save();
  return { sale };
};

const revertPayment = async (saleId, amount) => {
  const sale = await Sale.findById(saleId);
  if (!sale) return;
  sale.amountPaid = (sale.amountPaid || 0) - amount;
  if (sale.amountPaid < 0) sale.amountPaid = 0;
  await sale.save();
};

exports.createReceipt = async (req, res) => {
  try {
    const { customer, invoices, paymentMode, referenceNo, paymentDate } = req.body;
    if (!Array.isArray(invoices) || invoices.length === 0) {
      return res.status(400).json({ error: "Invoices are required" });
    }
    let total = 0;
    for (const item of invoices) {
      const result = await applyPayment(item.sale, item.amount);
      if (result.error) return res.status(400).json({ error: result.error });
      total += item.amount;
    }
    const receipt = new CustomerReceipt({
      customer,
      invoices,
      paymentMode,
      referenceNo,
      paymentDate,
      totalAmount: total,
    });
    await receipt.save();

    const cust = await Customer.findById(customer);
    if (cust) {
      cust.outstandingBalance = (cust.outstandingBalance || 0) - total;
      await cust.save();
    }

    res.status(201).json(receipt);
  } catch (error) {
    res.status(400).json({ error: "Failed to create receipt", details: error.message });
  }
};

exports.getAllReceipts = async (req, res) => {
  try {
    const receipts = await CustomerReceipt.find({ isDeleted: false })
      .populate("customer")
      .populate("invoices.sale");
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReceiptById = async (req, res) => {
  try {
    const receipt = await CustomerReceipt.findById(req.params.id)
      .populate("customer")
      .populate("invoices.sale");
    if (!receipt || receipt.isDeleted) return res.status(404).json({ error: "Receipt not found" });
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReceipt = async (req, res) => {
  try {
    const receipt = await CustomerReceipt.findById(req.params.id);
    if (!receipt || receipt.isDeleted) return res.status(404).json({ error: "Receipt not found" });

    // revert previous payments
    let oldTotal = 0;
    for (const item of receipt.invoices) {
      await revertPayment(item.sale, item.amount);
      oldTotal += item.amount;
    }
    const customer = await Customer.findById(receipt.customer);
    if (customer) {
      customer.outstandingBalance = (customer.outstandingBalance || 0) + oldTotal;
      await customer.save();
    }

    // apply new payments
    const { invoices, paymentMode, referenceNo, paymentDate, customer: newCust } = req.body;
    if (!Array.isArray(invoices) || invoices.length === 0) {
      return res.status(400).json({ error: "Invoices are required" });
    }
    let newTotal = 0;
    for (const item of invoices) {
      const result = await applyPayment(item.sale, item.amount);
      if (result.error) return res.status(400).json({ error: result.error });
      newTotal += item.amount;
    }

    const cust = await Customer.findById(newCust || receipt.customer);
    if (cust) {
      cust.outstandingBalance = (cust.outstandingBalance || 0) - newTotal;
      await cust.save();
    }

    receipt.customer = newCust || receipt.customer;
    receipt.invoices = invoices;
    receipt.paymentMode = paymentMode;
    receipt.referenceNo = referenceNo;
    receipt.paymentDate = paymentDate;
    receipt.totalAmount = newTotal;
    await receipt.save();

    res.json(receipt);
  } catch (error) {
    res.status(400).json({ error: "Failed to update receipt", details: error.message });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await CustomerReceipt.findById(req.params.id);
    if (!receipt || receipt.isDeleted) return res.status(404).json({ error: "Receipt not found" });

    let total = 0;
    for (const item of receipt.invoices) {
      await revertPayment(item.sale, item.amount);
      total += item.amount;
    }
    const customer = await Customer.findById(receipt.customer);
    if (customer) {
      customer.outstandingBalance = (customer.outstandingBalance || 0) + total;
      await customer.save();
    }

    receipt.isDeleted = true;
    receipt.deletedAt = new Date();
    await receipt.save();

    res.json({ message: "Receipt deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
