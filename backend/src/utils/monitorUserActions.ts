import AppDataSource from '../config/database';
import UserLog from '../model/UserLog';
import User from '../model/User';
import UserMonitoring from '../model/UserMonitoring';

const ACTION_LIMIT = 5; // 5 actions
const INTERVAL_MS = 10 * 60 * 1000; // last 10 minutes
const UTC_DIFFERENCE = 3 * 60 * 60 * 1000;

export async function checkUserActions() {
    const userLogRepo = AppDataSource.getRepository(UserLog);
    const userRepo = AppDataSource.getRepository(User);
    const userMonitoringRepo = AppDataSource.getRepository(UserMonitoring);

    console.log('Checking user actions...');

    const since = new Date(Date.now() - INTERVAL_MS);

    console.log("since " + since);
    const utcNowString = new Date().toISOString();
    console.log(utcNowString); // e.g., "2025-05-29T09:30:00.000Z"
    /*const nowUtc = new Date();
    const sinceUtc = new Date(nowUtc.getTime() - INTERVAL_MS);

    console.log(`Current UTC time: ${nowUtc.toISOString()}`);
    console.log(`Checking actions since UTC: ${sinceUtc.toISOString()}`);
*/
    const logs = await userLogRepo
        .createQueryBuilder('log')
        .leftJoinAndSelect('log.user', 'user')
        .where('log.timestamp > :since', { since })
        .andWhere('user.role = :role', { role: 'user' })
        .getMany();
    
    console.log("logs"+logs.length);

    const actionCounts: { [userId: number]: number } = {};
    logs.forEach(log => {
        if (log.user) {
            actionCounts[log.user.id] = (actionCounts[log.user.id] || 0) + 1;
            console.log("actionCounts"+actionCounts[log.user.id]);
        }
    });
    //here we must check that the user is not already in the UserMonitoring table,if it is,we must not add it to the table
    for (const userId in actionCounts) {
        console.log("userId"+userId);
        if (actionCounts[userId] > ACTION_LIMIT) {
            const user = await userRepo.findOne({ where: { id: Number(userId) } });
            if (user) {
                let userMonitoring = await userMonitoringRepo.findOne({ where: { user: { id: Number(userId) } } });
                if (userMonitoring) {
                    console.log(`User ${user.username} (ID: ${userId}) is already in the UserMonitoring table.`);
                    continue;
                }
                console.log(`User ${user.username} (ID: ${userId}) exceeded action limit with ${actionCounts[userId]} actions.`);
                // add user to the UserMonitoring table
                userMonitoring = new UserMonitoring();
                userMonitoring.user = user;
                userMonitoring.actionCount = actionCounts[userId];
                userMonitoring.flagged = true;
                await userMonitoringRepo.save(userMonitoring);
            }
        }
    }

    console.log('User actions checked.');
}


