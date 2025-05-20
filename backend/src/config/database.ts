import { DataSource } from 'typeorm';
import { Car } from '../model/Car';
import { Dealership } from '../model/Dealership';
import dotenv from 'dotenv';
import User from '../model/User';
import UserLog from '../model/UserLog';
import UserMonitoring from '../model/UserMonitoring';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Set to false when using migrations
    logging: true,
    entities: [Car, Dealership, User, UserLog, UserMonitoring],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [],
});

export default AppDataSource;