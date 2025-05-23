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
const monitorUserActions_1 = require("./utils/monitorUserActions");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const INTERVAL_MINUTES = 3 * 60 * 1000; // 3 minutes
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/cars', car_routes_1.default);
app.use('/api/dealerships', dealership_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/files', file_routes_1.default);
app.use('/api', server_routes_1.default);
// Initialize TypeORM connection
database_1.default.initialize()
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
setInterval(monitorUserActions_1.checkUserActions, INTERVAL_MINUTES);
