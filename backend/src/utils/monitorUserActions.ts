import { AppDataSource } from '../config/database';
import UserLog from '../model/UserLog';
import User from '../model/User';

const ACTION_LIMIT = 3; // X actions
const INTERVAL_MINUTES = 10* 60 * 1000; // 100 * 60,000ms = 10 minutes

export async function checkUserActions() {
    const userLogRepo = AppDataSource.getRepository(UserLog);
    const userRepo = AppDataSource.getRepository(User);

    console.log('Checking user actions...');

    const since = new Date(Date.now() - INTERVAL_MINUTES);

    const logs = await userLogRepo
        .createQueryBuilder('log')
        .leftJoinAndSelect('log.user', 'user')
        .where('log.timestamp > :since', { since })
        .andWhere('user.flagged = :flagged', { flagged: false })
        .andWhere('user.role = :role', { role: 'user' })
        .getMany();

    const actionCounts: { [userId: number]: number } = {};
    logs.forEach(log => {
        if (log.user) {
            actionCounts[log.user.id] = (actionCounts[log.user.id] || 0) + 1;
        }
    });

    for (const userId in actionCounts) {
        if (actionCounts[userId] > 3) {
            const user = await userRepo.findOne({ where: { id: Number(userId) } });
            if (user) {
                console.log(`User ${user.username} (ID: ${userId}) exceeded action limit with ${actionCounts[userId]} actions.`);
                user.flagged = true;
                await userRepo.save(user); // Optionally flag the user
            }
        }
    }

    console.log('User actions checked.');
}


