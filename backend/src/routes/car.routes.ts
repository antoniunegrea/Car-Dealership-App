import { Router } from 'express';
import { CarController } from '../controllers/CarController';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();
const carController = new CarController();

// Create a new car
router.post('/', authMiddleware, carController.create);

// Get all cars with filtering and sorting
router.get('/', carController.getAll);

// Get a single car by ID
router.get('/:id', carController.getOne);

// Update a car
router.put('/:id', authMiddleware, carController.update);

// Delete a car
router.delete('/:id', authMiddleware, carController.delete);

// Get car statistics
router.get('/stats', carController.getStats);

export default router; 