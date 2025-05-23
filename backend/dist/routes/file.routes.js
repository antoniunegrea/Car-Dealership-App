"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FileController_1 = require("../controllers/FileController");
const express_2 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const fileController = new FileController_1.FileController(Number(process.env.PORT) || 3000);
// Serve static files from uploads directory
router.use('/uploads', express_2.default.static(path_1.default.join(__dirname, '..', '..', 'uploads')));
// File upload endpoint
router.post('/upload', fileController.getUploadMiddleware(), fileController.uploadFile);
// File download endpoint
router.get('/download/:filename', fileController.downloadFile);
// List all files endpoint
router.get('/all', fileController.listFiles);
exports.default = router;
