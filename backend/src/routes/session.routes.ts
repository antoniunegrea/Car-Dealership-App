import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';

const router = Router();
const sessionController = new SessionController();

// Session routes
router.post('/', sessionController.createSession);
router.get('/', sessionController.getUserSessions);
router.delete('/:sessionId', sessionController.invalidateSession);
router.patch('/:sessionId/activity', sessionController.updateSessionActivity);

export default router; 