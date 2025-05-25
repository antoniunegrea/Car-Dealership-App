import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import Session from '../model/Session';
import User from '../model/User';
import { logUserAction } from '../utils/logService';
import { LessThan } from 'typeorm';

const sessionRepo = AppDataSource.getRepository(Session);
const userRepo = AppDataSource.getRepository(User);

// Session timeout in minutes
const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT ? parseInt(process.env.SESSION_TIMEOUT) : 120; // 2 hours default
const INACTIVITY_TIMEOUT = process.env.INACTIVITY_TIMEOUT ? parseInt(process.env.INACTIVITY_TIMEOUT) : 30; // 30 minutes default

export class SessionController {
    // Create a new session
    createSession = async (req: Request, res: Response): Promise<void> => {
        console.log('>>> createSession HIT');
        console.log('Request body:', req.body);
        console.log('User from request:', (req as any).user);

        const { token, deviceInfo } = req.body;
        const userId = (req as any).user?.id;

        if (!userId) {
            console.error('No user ID found in request');
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        try {
            const user = await userRepo.findOne({ where: { id: userId } });
            if (!user) {
                console.error('User not found:', userId);
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_TIMEOUT);

            const session = sessionRepo.create({
                token,
                deviceInfo,
                isActive: true,
                user: { id: userId },
                expiresAt,
                lastActivity: new Date()
            });

            console.log('Creating session:', session);
            const savedSession = await sessionRepo.save(session);
            console.log('Session created successfully:', savedSession);

            await logUserAction(user, 'SESSION_CREATE', `New session created for user ${user.username}`);
            res.status(201).json(savedSession);
        } catch (error: any) {
            console.error('Session creation error:', error);
            res.status(500).json({ error: 'Failed to create session', details: error.message });
        }
    };

    // Get all active sessions for the current user
    getUserSessions = async (req: Request, res: Response): Promise<void> => {
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        try {
            await this.checkAndInvalidateExpiredSessions(userId);

            const sessions = await sessionRepo.find({
                where: { user: { id: userId }, isActive: true },
                order: { lastActivity: 'DESC' }
            });
            res.json(sessions);
        } catch (error: any) {
            console.error('Error fetching user sessions:', error);
            res.status(500).json({ error: 'Failed to fetch sessions', details: error.message });
        }
    };

    // Invalidate a session (logout)
    invalidateSession = async (req: Request, res: Response): Promise<void> => {
        const { sessionId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

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
        } catch (error: any) {
            console.error('Error invalidating session:', error);
            res.status(500).json({ error: 'Failed to invalidate session', details: error.message });
        }
    };

    // Update session activity
    updateSessionActivity = async (req: Request, res: Response): Promise<void> => {
        const { sessionId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        try {
            const session = await sessionRepo.findOne({
                where: { id: parseInt(sessionId), user: { id: userId }, isActive: true }
            });

            if (!session) {
                res.status(404).json({ error: 'Session not found' });
                return;
            }

            if (new Date() > session.expiresAt) {
                session.isActive = false;
                await sessionRepo.save(session);
                res.status(401).json({ error: 'Session has expired' });
                return;
            }

            session.lastActivity = new Date();
            const newExpiresAt = new Date();
            newExpiresAt.setMinutes(newExpiresAt.getMinutes() + SESSION_TIMEOUT);
            session.expiresAt = newExpiresAt;

            await sessionRepo.save(session);
            res.json({ message: 'Session activity updated' });
        } catch (error: any) {
            console.error('Error updating session activity:', error);
            res.status(500).json({ error: 'Failed to update session activity', details: error.message });
        }
    };

    // Helper method to check and invalidate expired sessions
    private async checkAndInvalidateExpiredSessions(userId: number): Promise<void> {
        const now = new Date();
        const inactiveThreshold = new Date(now.getTime() - (INACTIVITY_TIMEOUT * 60 * 1000));

        try {
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
        } catch (error: any) {
            console.error('Error checking expired sessions:', error);
        }
    }
} 