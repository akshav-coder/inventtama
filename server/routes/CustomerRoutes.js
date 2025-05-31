const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET all customers
router.get("/all", customerController.getAllCustomers);

// GET a single customer by ID
router.get("/by-id/:id", customerController.getCustomerById);

// POST create a new customer
router.post("/create", customerController.createCustomer);

// PUT update a customer
router.put("/update/:id", customerController.updateCustomer);

// DELETE a customer
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
