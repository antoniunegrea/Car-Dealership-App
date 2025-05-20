import AppDataSource from '../config/database';
import { Request, Response } from 'express';
import UserMonitoring from '../model/UserMonitoring';

const userMonitoringRepo = AppDataSource.getRepository(UserMonitoring);

export class AdminController {
    getMonitoredUsers = async (req: Request, res: Response): Promise<void> => {
        const users = await userMonitoringRepo.find({
            relations: ['user']
        });
        res.json(users);
    }
}
