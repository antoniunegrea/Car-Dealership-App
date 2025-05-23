import { Router } from 'express';
import { FileController } from '../controllers/fileController';
import express from 'express';
import path from 'path';

const router = Router();
const fileController = new FileController(Number(process.env.PORT) || 3000);

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File upload endpoint
router.post('/upload', fileController.getUploadMiddleware(), fileController.uploadFile);

// File download endpoint
router.get('/download/:filename', fileController.downloadFile);

// List all files endpoint
router.get('/all', fileController.listFiles);

export default router; 