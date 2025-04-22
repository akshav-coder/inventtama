const express = require("express");
const router = express.Router();
const controller = require("../controllers/supplierCreditController");

router.post("/", controller.createOrUpdateSupplierCredit);
router.get("/", controller.getAllSupplierCredits);
router.get("/:supplierName", controller.getSupplierCreditByName);
router.delete("/:id", controller.deleteSupplierCredit);

module.exports = router;
