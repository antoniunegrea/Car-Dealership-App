"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
//router.get('/monitored-users', roleMiddleware(['admin']), adminController.getMonitoredUsers);
router.get('/monitored-users', adminController.getMonitoredUsers);
exports.default = router;
