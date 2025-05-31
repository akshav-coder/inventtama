const express = require("express");
const router = express.Router();
const lotController = require("../controllers/lotController");

// GET all lots or filter by coldStorageId
router.get("/lots", lotController.getLotsByFacility);

// POST create a new lot
router.post("/lots", lotController.createLot);

// PUT update an existing lot (e.g., increase/decrease quantity, mark inactive)
router.put("/lots/:id", lotController.updateLot);

module.exports = router;
