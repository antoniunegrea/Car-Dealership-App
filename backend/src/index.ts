import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import AppDataSource from './config/database';
import carRoutes from './routes/car.routes';
import dealershipRoutes from './routes/dealership.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import fileRoutes from './routes/file.routes';
import serverRoutes from './routes/server.routes';
import sessionRoutes from './routes/session.routes';
import { checkUserActions } from './utils/monitorUserActions';

const app = express();
const PORT = process.env.PORT || 3000;

const INTERVAL_MINUTES = 3 * 60 * 1000; // 3 minutes

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/dealerships', dealershipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', serverRoutes);

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });

// Run every Y minutes
setInterval(checkUserActions, INTERVAL_MINUTES);
