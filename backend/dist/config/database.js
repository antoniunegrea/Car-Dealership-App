"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Car_1 = require("../model/Car");
const Dealership_1 = require("../model/Dealership");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../model/User"));
const UserLog_1 = __importDefault(require("../model/UserLog"));
const UserMonitoring_1 = __importDefault(require("../model/UserMonitoring"));
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('Missing required environment variable: DATABASE_URL');
}
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: databaseUrl,
    synchronize: false,
    logging: true,
    entities: [Car_1.Car, Dealership_1.Dealership, User_1.default, UserLog_1.default, UserMonitoring_1.default],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [],
});
exports.default = AppDataSource;
