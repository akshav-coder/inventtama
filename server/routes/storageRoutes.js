const express = require("express");
const router = express.Router();
const controller = require("../controllers/storageController");

router.post("/", controller.createStorageEntry);
router.get("/", controller.getStorageEntries);
router.get("/:id", controller.getStorageById);
router.put("/:id", controller.updateStorageEntry);
router.delete("/:id", controller.deleteStorageEntry);

module.exports = router;
