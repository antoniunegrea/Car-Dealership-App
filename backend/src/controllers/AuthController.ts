// backend/src/controllers/AuthController.ts
import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import User from '../model/User';
import jwt from 'jsonwebtoken';
import { logUserAction } from '../utils/logService';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const SALT_ROUNDS = 10;

const userRepo = AppDataSource.getRepository(User);

export class AuthController {
    // login
    login = async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body;
        const user = await userRepo.findOne({ where: { username } });
        
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        await logUserAction(user, 'LOGIN', `User ${user.username} logged in`);
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    };

    // register
    register = async (req: Request, res: Response): Promise<void> => {
        const { username, password, role } = req.body;
        const existingUser = await userRepo.findOne({ where: { username } });
        if (existingUser) {
            res.status(400).json({ error: 'Username already exists' });
            return;
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = userRepo.create({ username, password: hashedPassword, role });
        await userRepo.save(user);
        await logUserAction(user, 'REGISTER', `User ${user.username} registered`);
        res.json(user);
    };
}