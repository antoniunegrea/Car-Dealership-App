import { Router } from 'express';
import { DealershipController } from '../controllers/DealershipController';

const router = Router();
const dealershipController = new DealershipController();

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

export default router; 