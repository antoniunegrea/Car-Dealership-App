import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import Session from '../model/Session';
import User from '../model/User';
import { logUserAction } from '../utils/logService';
import { LessThan } from 'typeorm';

const sessionRepo = AppDataSource.getRepository(Session);
const userRepo = AppDataSource.getRepository(User);

// Session timeout in minutes
const SESSION_TIMEOUT = 30; // 30 minutes
const INACTIVITY_TIMEOUT = 15; // 15 minutes

export class SessionController {
    // Create a new session
    createSession = async (req: Request, res: Response): Promise<void> => {
        const { token, deviceInfo } = req.body;
        const userId = (req as any).user.id;

        try {
            const user = await userRepo.findOne({ where: { id: userId } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_TIMEOUT);

            const session = sessionRepo.create({
                token,
                deviceInfo,
                isActive: true,
                user: { id: userId }, // Only pass the user ID
                expiresAt,
                lastActivity: new Date()
            });

            const savedSession = await sessionRepo.save(session);
            await logUserAction(user, 'SESSION_CREATE', `New session created for user ${user.username}`);
            res.status(201).json(savedSession);
        } catch (error) {
            console.error('Session creation error:', error);
            res.status(500).json({ error: 'Failed to create session' });
        }
    };

    // Get all active sessions for the current user
    getUserSessions = async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user.id;

        try {
            // First, check and invalidate expired sessions
            await this.checkAndInvalidateExpiredSessions(userId);

            const sessions = await sessionRepo.find({
                where: { user: { id: userId }, isActive: true },
                order: { lastActivity: 'DESC' }
            });
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch sessions' });
        }
    };

    // Invalidate a session (logout)
    invalidateSession = async (req: Request, res: Response): Promise<void> => {
        const { sessionId } = req.params;
        const userId = (req as any).user.id;

        try {
            const session = await sessionRepo.findOne({
                where: { id: parseInt(sessionId), user: { id: userId } }
            });

            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            session.isActive = false;
            await sessionRepo.save(session);
            await logUserAction(session.user, 'SESSION_INVALIDATE', `Session invalidated for user ${session.user.username}`);
            res.json({ message: 'Session invalidated successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to invalidate session' });
        }
    };

    // Update session activity
    updateSessionActivity = async (req: Request, res: Response): Promise<void> => {
        const { sessionId } = req.params;
        const userId = (req as any).user.id;

        try {
            const session = await sessionRepo.findOne({
                where: { id: parseInt(sessionId), user: { id: userId }, isActive: true }
            });

            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            // Check if session has expired
            if (new Date() > session.expiresAt) {
                session.isActive = false;
                await sessionRepo.save(session);
                res.status(401).json({ error: 'Session has expired' });
                return;
            }

            // Update last activity and extend session if needed
            session.lastActivity = new Date();
            
            // Extend session timeout if user is active
            const newExpiresAt = new Date();
            newExpiresAt.setMinutes(newExpiresAt.getMinutes() + SESSION_TIMEOUT);
            session.expiresAt = newExpiresAt;

            await sessionRepo.save(session);
            res.json({ message: 'Session activity updated' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update session activity' });
        }
    };

    // Helper method to check and invalidate expired sessions
    private async checkAndInvalidateExpiredSessions(userId: number): Promise<void> {
        const now = new Date();
        const inactiveThreshold = new Date(now.getTime() - (INACTIVITY_TIMEOUT * 60 * 1000));

        const expiredSessions = await sessionRepo.find({
            where: [
                { user: { id: userId }, expiresAt: LessThan(now) },
                { user: { id: userId }, lastActivity: LessThan(inactiveThreshold) }
            ]
        });

        for (const session of expiredSessions) {
            session.isActive = false;
            await sessionRepo.save(session);
            await logUserAction(session.user, 'SESSION_EXPIRED', `Session expired for user ${session.user.username}`);
        }
    }
} 