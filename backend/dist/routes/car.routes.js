"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CarController_1 = require("../controllers/CarController");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
const carController = new CarController_1.CarController();
// Get car statistics
router.get('/stats', carController.getStats);
// Create a new car
router.post('/', authMiddleware_1.authMiddleware, carController.create);
// Get all cars with filtering and sorting
router.get('/', carController.getAll);
// Get a single car by ID
router.get('/:id', carController.getOne);
// Update a car
router.put('/:id', authMiddleware_1.authMiddleware, carController.update);
// Delete a car
router.delete('/:id', authMiddleware_1.authMiddleware, carController.delete);
exports.default = router;
