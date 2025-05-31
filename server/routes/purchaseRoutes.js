// routes/purchase.routes.js
const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

// Create a new purchase
router.post("/", purchaseController.createPurchase);

// Get all purchases
router.get("/", purchaseController.getAllPurchases);

// Get a single purchase by ID
router.get("/:id", purchaseController.getPurchaseById);

// Update a purchase by ID
router.put("/:id", purchaseController.updatePurchase);

// Delete a purchase by ID
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
