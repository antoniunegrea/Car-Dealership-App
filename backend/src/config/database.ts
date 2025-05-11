import { DataSource } from 'typeorm';
import { Car } from '../model/Car';
import { Dealership } from '../model/Dealership';
import dotenv from 'dotenv';
import User from '../model/User';
import UserLog from '../model/UserLog';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Set to false in production
    logging: true,
    entities: [Car, Dealership, User, UserLog],
    subscribers: [],
    migrations: [],
}); 