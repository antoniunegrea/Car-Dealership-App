import AppDataSource from '../config/database';
import UserLog from '../model/UserLog';
import User from '../model/User';

export async function logUserAction(user: User, actionType: string, details?: string) {
    const logRepo = AppDataSource.getRepository(UserLog);
    const log = logRepo.create({
        user,
        actionType,
        details,
    });
    await logRepo.save(log);
}