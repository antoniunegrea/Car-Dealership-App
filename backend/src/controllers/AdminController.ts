import { AppDataSource } from '../config/database';
import { Request, Response } from 'express';
import User from '../model/User';
import UserLog from '../model/UserLog';

const userRepo = AppDataSource.getRepository(User);
const logRepo = AppDataSource.getRepository(UserLog);

export class AdminController {
    // Get all users
    getMonitoredUsers = async (req: Request, res: Response): Promise<void> => {
        // Get only flagged users
        const users = await userRepo.find({ where: { flagged: true } });
        // For each user, count their actions
        const monitored = await Promise.all(users.map(async user => {
            const actionCount = await logRepo.count({ where: { user: { id: user.id } } });
            return {
                id: user.id,
                username: user.username,
                actionCount
            };
        }));
        res.json(monitored);
    }
}
