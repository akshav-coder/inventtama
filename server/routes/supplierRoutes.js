const express = require("express");
const {
  addSupplier,
  getSuppliers,
} = require("../controllers/supplierController");
const router = express.Router();

router.post("/add", addSupplier);
router.get("/list", getSuppliers);

module.exports = router;
