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
exports.checkUserActions = checkUserActions;
const database_1 = __importDefault(require("../config/database"));
const UserLog_1 = __importDefault(require("../model/UserLog"));
const User_1 = __importDefault(require("../model/User"));
const UserMonitoring_1 = __importDefault(require("../model/UserMonitoring"));
const ACTION_LIMIT = 9; // X actions
const INTERVAL_MINUTES = 3 * 60 * 1000; // 100 * 60,000ms = 5 minutes
function checkUserActions() {
    return __awaiter(this, void 0, void 0, function* () {
        const userLogRepo = database_1.default.getRepository(UserLog_1.default);
        const userRepo = database_1.default.getRepository(User_1.default);
        const userMonitoringRepo = database_1.default.getRepository(UserMonitoring_1.default);
        console.log('Checking user actions...');
        const since = new Date(Date.now() - INTERVAL_MINUTES);
        const logs = yield userLogRepo
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .where('log.timestamp > :since', { since })
            .andWhere('user.role = :role', { role: 'user' })
            .getMany();
        const actionCounts = {};
        logs.forEach(log => {
            if (log.user) {
                actionCounts[log.user.id] = (actionCounts[log.user.id] || 0) + 1;
            }
        });
        for (const userId in actionCounts) {
            if (actionCounts[userId] > ACTION_LIMIT) {
                const user = yield userRepo.findOne({ where: { id: Number(userId) } });
                if (user) {
                    console.log(`User ${user.username} (ID: ${userId}) exceeded action limit with ${actionCounts[userId]} actions.`);
                    // add user to the UserMonitoring table
                    const userMonitoring = new UserMonitoring_1.default();
                    userMonitoring.user = user;
                    userMonitoring.actionCount = actionCounts[userId];
                    userMonitoring.flagged = true;
                    yield userMonitoringRepo.save(userMonitoring);
                }
            }
        }
        console.log('User actions checked.');
    });
}
