const express = require("express");
const router = express.Router();
const controller = require("../controllers/saleController");

router.post("/", controller.createSale);
router.get("/", controller.getAllSales);
router.get("/:id", controller.getSaleById);
router.put("/:id", controller.updateSale);
router.delete("/:id", controller.deleteSale);

module.exports = router;
