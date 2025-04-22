const express = require("express");
const router = express.Router();
const controller = require("../controllers/processingController");

router.post("/", controller.createProcessing);
router.get("/", controller.getAllProcessing);
router.get("/:id", controller.getProcessingById);
router.put("/:id", controller.updateProcessing);
router.delete("/:id", controller.deleteProcessing);

module.exports = router;
