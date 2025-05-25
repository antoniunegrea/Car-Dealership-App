import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();
const sessionController = new SessionController();

// Session routes
router.post('/', authMiddleware, sessionController.createSession);
router.get('/', authMiddleware, sessionController.getUserSessions);
router.delete('/:sessionId', authMiddleware, sessionController.invalidateSession);
router.patch('/:sessionId/activity', authMiddleware, sessionController.updateSessionActivity);

export default router; 