"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const car_routes_1 = __importDefault(require("./routes/car.routes"));
const dealership_routes_1 = __importDefault(require("./routes/dealership.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const file_routes_1 = __importDefault(require("./routes/file.routes"));
const server_routes_1 = __importDefault(require("./routes/server.routes"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const monitorUserActions_1 = require("./utils/monitorUserActions");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const INTERVAL_MINUTES = 3 * 60 * 1000; // 3 minutes
// Detailed request logging middleware
app.use((req, res, next) => {
    console.log('=== Incoming Request ===');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('=====================');
    next();
});
// Middleware
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/cars', car_routes_1.default);
app.use('/api/dealerships', dealership_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/files', file_routes_1.default);
app.use('/api/sessions', session_routes_1.default);
app.use('/api', server_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});
// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ error: 'Not found', path: req.path });
});
// Initialize TypeORM connection
database_1.default.initialize()
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
setInterval(monitorUserActions_1.checkUserActions, INTERVAL_MINUTES);
