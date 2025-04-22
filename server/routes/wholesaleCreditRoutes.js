const express = require("express");
const router = express.Router();
const controller = require("../controllers/wholesaleCreditController");

router.post("/", controller.createOrUpdateCredit);
router.get("/", controller.getAllCredits);
router.get("/:buyerName", controller.getCreditByBuyer);
router.delete("/:id", controller.deleteCreditEntry);

module.exports = router;
