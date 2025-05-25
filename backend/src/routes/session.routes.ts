import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';
import { authMiddleware } from '../utils/authMiddleware';

const router = Router();
const sessionController = new SessionController();

// Session routes with error handling
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        console.log('Session creation route hit');
        await sessionController.createSession(req, res);
    } catch (error) {
        console.error('Error in session creation:', error);
        next(error);
    }
});

router.get('/', authMiddleware, async (req, res, next) => {
    try {
        await sessionController.getUserSessions(req, res);
    } catch (error) {
        console.error('Error getting user sessions:', error);
        next(error);
    }
});

router.delete('/:sessionId', authMiddleware, async (req, res, next) => {
    try {
        await sessionController.invalidateSession(req, res);
    } catch (error) {
        console.error('Error invalidating session:', error);
        next(error);
    }
});

router.patch('/:sessionId/activity', authMiddleware, async (req, res, next) => {
    try {
        await sessionController.updateSessionActivity(req, res);
    } catch (error) {
        console.error('Error updating session activity:', error);
        next(error);
    }
});

export default router; 