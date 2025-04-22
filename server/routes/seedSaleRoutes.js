const express = require("express");
const router = express.Router();
const controller = require("../controllers/seedSaleController");

router.post("/", controller.createSeedSale);
router.get("/", controller.getAllSeedSales);
router.get("/:id", controller.getSeedSaleById);
router.put("/:id", controller.updateSeedSale);
router.delete("/:id", controller.deleteSeedSale);

module.exports = router;
