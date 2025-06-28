const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerReceiptController");

router.post("/", controller.createReceipt);
router.get("/", controller.getAllReceipts);
router.get("/:id", controller.getReceiptById);
router.put("/:id", controller.updateReceipt);
router.delete("/:id", controller.deleteReceipt);

module.exports = router;
