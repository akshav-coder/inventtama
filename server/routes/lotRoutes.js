const express = require("express");
const router = express.Router();
const lotController = require("../controllers/lotController");

router.get("/", lotController.getLotsByFacility);

module.exports = router;
