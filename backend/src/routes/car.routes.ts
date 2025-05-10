import { Router } from 'express';
import { CarController } from '../controllers/CarController';

const router = Router();
const carController = new CarController();

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

export default router; 