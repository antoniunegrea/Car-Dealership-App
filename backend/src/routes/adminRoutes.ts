import { Router } from 'express';
import { AppDataSource } from '../config/database';
import User from '../model/User';
import UserLog from '../model/UserLog';
import { roleMiddleware } from '../utils/roleMiddleware';
import { AdminController } from '../controllers/AdminController';

const router = Router();
const adminController = new AdminController();
// backend/src/routes/adminRoutes.ts
router.get('/monitored-users', adminController.getMonitoredUsers);

export default router;
