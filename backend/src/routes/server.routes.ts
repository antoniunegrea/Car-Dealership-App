import { Router } from 'express';
import { ServerController } from '../controllers/ServerController';

const router = Router();
const serverController = new ServerController();

// Health check endpoint
router.get('/health', serverController.healthCheck);

export default router; 