"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DealershipController_1 = require("../controllers/DealershipController");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
const dealershipController = new DealershipController_1.DealershipController();
// Create a new dealership
router.post('/', authMiddleware_1.authMiddleware, dealershipController.create);
// Get all dealerships with filtering
router.get('/', dealershipController.getAll);
// Get a single dealership by ID
router.get('/:id', dealershipController.getOne);
// Update a dealership
router.put('/:id', authMiddleware_1.authMiddleware, dealershipController.update);
// Delete a dealership
router.delete('/:id', authMiddleware_1.authMiddleware, dealershipController.delete);
exports.default = router;
