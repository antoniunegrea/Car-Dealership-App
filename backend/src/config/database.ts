import { DataSource } from 'typeorm';
import { Car } from '../model/Car';
import { Dealership } from '../model/Dealership';
import dotenv from 'dotenv';
import User from '../model/User';
import UserLog from '../model/UserLog';
import UserMonitoring from '../model/UserMonitoring';
import Session from '../model/Session';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('Missing required environment variable: DATABASE_URL');
}

const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    synchronize: false,
    logging: true,
    entities: [Car, Dealership, User, UserLog, UserMonitoring, Session],
    migrations: ['dist/migrations/*.js'],
    //migrations: ['src/migrations/*.ts'],
    //migrations: ['src/migrations/*.ts'],
    //migrationsTableName: 'migrations',
    subscribers: [],
});

export default AppDataSource;
