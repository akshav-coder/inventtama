const express = require("express");
const router = express.Router();
const processingController = require("../controllers/processingController");
const auth = require("../middleware/auth");

// All routes are protected with authentication
router.use(auth);

// Create a new processing record
router.post("/", processingController.createProcessing);

// Get all processing records
router.get("/", processingController.getAllProcessing);

// Get a single processing record
router.get("/:id", processingController.getProcessingById);

// Update a processing record
router.put("/:id", processingController.updateProcessing);

// Delete a processing record
router.delete("/:id", processingController.deleteProcessing);

module.exports = router;
