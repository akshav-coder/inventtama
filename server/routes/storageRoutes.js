const express = require("express");
const router = express.Router();
const StorageController = require("../controllers/storageController");

// GET storages by type (cold or unit)
router.get("/storages", StorageController.getStorages);

// POST create a new unit or cold storage
router.post("/storages", StorageController.createStorage);

module.exports = router;
