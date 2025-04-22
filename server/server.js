const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const purchaseRoutes = require("./routes/purchaseRoutes");
const storageRoutes = require("./routes/storageRoutes");
const processingRoutes = require("./routes/processingRoutes");
const unitTransferRoutes = require("./routes/unitTransferRoutes");
const saleRoutes = require("./routes/saleRoutes");
const wholesaleCreditRoutes = require("./routes/wholesaleCreditRoutes");
const supplierCreditRoutes = require("./routes/supplierCreditRoutes");
const seedSaleRoutes = require("./routes/seedSaleRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/purchases", purchaseRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/processing", processingRoutes);
app.use("/api/unit-transfers", unitTransferRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/wholesale-credit", wholesaleCreditRoutes);
app.use("/api/supplier-credit", supplierCreditRoutes);
app.use("/api/seed-sales", seedSaleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Tamarind Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
