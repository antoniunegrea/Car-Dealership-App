"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DealershipController_1 = require("../controllers/DealershipController");
const router = (0, express_1.Router)();
const dealershipController = new DealershipController_1.DealershipController();
// Create a new dealership
router.post('/', dealershipController.create);
// Get all dealerships with filtering
router.get('/', dealershipController.getAll);
// Get a single dealership by ID
router.get('/:id', dealershipController.getOne);
// Update a dealership
router.put('/:id', dealershipController.update);
// Delete a dealership
router.delete('/:id', dealershipController.delete);
exports.default = router;
