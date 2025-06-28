const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const storageRoutes = require("./routes/storageRoutes");
const processingRoutes = require("./routes/processing");
const unitTransferRoutes = require("./routes/unitTransferRoutes");
const saleRoutes = require("./routes/saleRoutes");
const authRoutes = require("./routes/authRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/CustomerRoutes");
const lotRoutes = require("./routes/lotRoutes");
const supplierPaymentRoutes = require("./routes/supplierPaymentRoutes");
const customerReceiptRoutes = require("./routes/customerReceiptRoutes");
const reportRoutes = require("./routes/reportRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/processing", processingRoutes);
app.use("/api/unit-transfers", unitTransferRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/supplier-payments", supplierPaymentRoutes);
app.use("/api/customer-receipts", customerReceiptRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", storageRoutes);
app.use("/api/purchases", require("./routes/purchaseRoutes"));
app.use("/api", lotRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Tamarind Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
