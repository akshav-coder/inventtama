const express = require("express");
const router = express.Router();
const { addStorageOption } = require("../controllers/storageController");

router.post("/", addStorageOption);

module.exports = router;
