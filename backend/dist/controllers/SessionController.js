"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const database_1 = __importDefault(require("../config/database"));
const Session_1 = __importDefault(require("../model/Session"));
const User_1 = __importDefault(require("../model/User"));
const logService_1 = require("../utils/logService");
const typeorm_1 = require("typeorm");
const sessionRepo = database_1.default.getRepository(Session_1.default);
const userRepo = database_1.default.getRepository(User_1.default);
// Session timeout in minutes
const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT ? parseInt(process.env.SESSION_TIMEOUT) : 120; // 2 hours default
const INACTIVITY_TIMEOUT = process.env.INACTIVITY_TIMEOUT ? parseInt(process.env.INACTIVITY_TIMEOUT) : 30; // 30 minutes default
class SessionController {
    constructor() {
        // Create a new session
        this.createSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('>>> createSession HIT');
            console.log('Request body:', req.body);
            console.log('User from request:', req.user);
            const { token, deviceInfo } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                console.error('No user ID found in request');
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            try {
                const user = yield userRepo.findOne({ where: { id: userId } });
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
                const savedSession = yield sessionRepo.save(session);
                console.log('Session created successfully:', savedSession);
                yield (0, logService_1.logUserAction)(user, 'SESSION_CREATE', `New session created for user ${user.username}`);
                res.status(201).json(savedSession);
            }
            catch (error) {
                console.error('Session creation error:', error);
                res.status(500).json({ error: 'Failed to create session', details: error.message });
            }
        });
        // Get all active sessions for the current user
        this.getUserSessions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            try {
                yield this.checkAndInvalidateExpiredSessions(userId);
                const sessions = yield sessionRepo.find({
                    where: { user: { id: userId }, isActive: true },
                    order: { lastActivity: 'DESC' }
                });
                res.json(sessions);
            }
            catch (error) {
                console.error('Error fetching user sessions:', error);
                res.status(500).json({ error: 'Failed to fetch sessions', details: error.message });
            }
        });
        // Invalidate a session (logout)
        this.invalidateSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { sessionId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            try {
                const session = yield sessionRepo.findOne({
                    where: { id: parseInt(sessionId), user: { id: userId } }
                });
                if (!session) {
                    res.status(404).json({ error: 'Session not found' });
                    return;
                }
                session.isActive = false;
                yield sessionRepo.save(session);
                yield (0, logService_1.logUserAction)(session.user, 'SESSION_INVALIDATE', `Session invalidated for user ${session.user.username}`);
                res.json({ message: 'Session invalidated successfully' });
            }
            catch (error) {
                console.error('Error invalidating session:', error);
                res.status(500).json({ error: 'Failed to invalidate session', details: error.message });
            }
        });
        // Update session activity
        this.updateSessionActivity = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { sessionId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            try {
                const session = yield sessionRepo.findOne({
                    where: { id: parseInt(sessionId), user: { id: userId }, isActive: true }
                });
                if (!session) {
                    res.status(404).json({ error: 'Session not found' });
                    return;
                }
                if (new Date() > session.expiresAt) {
                    session.isActive = false;
                    yield sessionRepo.save(session);
                    res.status(401).json({ error: 'Session has expired' });
                    return;
                }
                session.lastActivity = new Date();
                const newExpiresAt = new Date();
                newExpiresAt.setMinutes(newExpiresAt.getMinutes() + SESSION_TIMEOUT);
                session.expiresAt = newExpiresAt;
                yield sessionRepo.save(session);
                res.json({ message: 'Session activity updated' });
            }
            catch (error) {
                console.error('Error updating session activity:', error);
                res.status(500).json({ error: 'Failed to update session activity', details: error.message });
            }
        });
    }
    // Helper method to check and invalidate expired sessions
    checkAndInvalidateExpiredSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const inactiveThreshold = new Date(now.getTime() - (INACTIVITY_TIMEOUT * 60 * 1000));
            try {
                const expiredSessions = yield sessionRepo.find({
                    where: [
                        { user: { id: userId }, expiresAt: (0, typeorm_1.LessThan)(now) },
                        { user: { id: userId }, lastActivity: (0, typeorm_1.LessThan)(inactiveThreshold) }
                    ]
                });
                for (const session of expiredSessions) {
                    session.isActive = false;
                    yield sessionRepo.save(session);
                    yield (0, logService_1.logUserAction)(session.user, 'SESSION_EXPIRED', `Session expired for user ${session.user.username}`);
                }
            }
            catch (error) {
                console.error('Error checking expired sessions:', error);
            }
        });
    }
}
exports.SessionController = SessionController;
