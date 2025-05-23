"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServerController_1 = require("../controllers/ServerController");
const router = (0, express_1.Router)();
const serverController = new ServerController_1.ServerController();
// Health check endpoint
router.get('/health', serverController.healthCheck);
exports.default = router;
