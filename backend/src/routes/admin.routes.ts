import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { roleMiddleware } from '../utils/roleMiddleware';

const router = Router();
const adminController = new AdminController();

//router.get('/monitored-users', roleMiddleware(['admin']), adminController.getMonitoredUsers);
router.get('/monitored-users', adminController.getMonitoredUsers);

export default router;
