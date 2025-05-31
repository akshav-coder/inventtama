const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

// GET all suppliers
router.get("/all", supplierController.getAllSuppliers);

// GET a supplier by ID
router.get("/by-id/:id", supplierController.getSupplierById);

// POST create a new supplier
router.post("/create", supplierController.createSupplier);

// PUT update a supplier by ID
router.put("/update/:id", supplierController.updateSupplier);

// DELETE a supplier by ID
router.delete("/delete/:id", supplierController.deleteSupplier);

module.exports = router;
