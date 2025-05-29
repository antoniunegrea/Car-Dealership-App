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

const INTERVAL_MINUTES =  2 * 60 * 1000; // 2 minutes


// Middleware
app.use(cors({
    origin: '*', // Allow all origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/dealerships', dealershipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api', serverRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Initialize TypeORM connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Available routes:');
            console.log('- POST /api/sessions');
            console.log('- GET /api/sessions');
            console.log('- DELETE /api/sessions/:sessionId');
            console.log('- PATCH /api/sessions/:sessionId/activity');
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
    });

// Run every Y minutes
setInterval(checkUserActions, INTERVAL_MINUTES);
