import { Router } from 'express';
import { DealershipController } from '../controllers/DealershipController';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();
const dealershipController = new DealershipController();

// Create a new dealership
router.post('/', authMiddleware, dealershipController.create);

// Get all dealerships with filtering
router.get('/', dealershipController.getAll);

// Get a single dealership by ID
router.get('/:id', dealershipController.getOne);

// Update a dealership
router.put('/:id', authMiddleware, dealershipController.update);

// Delete a dealership
router.delete('/:id', authMiddleware, dealershipController.delete);

export default router; 