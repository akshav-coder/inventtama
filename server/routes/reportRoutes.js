const express = require("express");
const router = express.Router();
const controller = require("../controllers/reportController");

router.get("/purchases", controller.purchases);
router.get("/sales", controller.sales);
router.get("/transfers", controller.transfers);
router.get("/processing", controller.processing);
router.get("/stock", controller.stock);
router.get("/payments", controller.payments);

module.exports = router;
