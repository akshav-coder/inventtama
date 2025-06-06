const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

router.get("/", facilityController.getFacilities);

module.exports = router;
