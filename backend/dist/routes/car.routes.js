"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CarController_1 = require("../controllers/CarController");
const router = (0, express_1.Router)();
const carController = new CarController_1.CarController();
// Create a new car
router.post('/', carController.create);
// Get all cars with filtering and sorting
router.get('/', carController.getAll);
// Get a single car by ID
router.get('/:id', carController.getOne);
// Update a car
router.put('/:id', carController.update);
// Delete a car
router.delete('/:id', carController.delete);
exports.default = router;
