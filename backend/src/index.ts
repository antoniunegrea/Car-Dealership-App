import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import carRoutes from './routes/car.routes';
import dealershipRoutes from './routes/dealership.routes';
import runDaemonThread from './utils/daemonThread';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Car } from './model/Car';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { checkUserActions } from './utils/monitorUserActions';

const app = express();
const PORT = process.env.PORT || 3000;

const INTERVAL_MINUTES = 1 * 60 * 1000; // Y minutes

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/dealerships', dealershipRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use('/api/stats', async (req, res) => {
  try {
    const data = await AppDataSource.getRepository(Car)
      .createQueryBuilder('car')
      .select('car.manufacturer', 'manufacturer')
      .addSelect('AVG(car.price)', 'averagePrice')
      .groupBy('car.manufacturer')
      .orderBy('AVG(car.price)', 'DESC')
      .getRawMany();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//run daemon thred to add random cars
//runDaemonThread(app);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10000 * 1024 * 1024 }, // Limit to 10000MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mov|avi|mkv|zip|rar/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const allowedMimeTypes = [
            'video/mp4',
            'video/quicktime', 
            'video/x-msvideo', 
            'video/x-matroska',
            'application/zip', 
            'application/x-rar-compressed',
            'application/x-zip-compressed',
            'application/rar',
            'application/octet-stream',
        ];
        console.log(`File: ${file.originalname}, MIME Type: ${file.mimetype}`);
        const mimetype = allowedMimeTypes.includes(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            console.log(`Rejected file: ${file.originalname}, extname: ${extname}, mimetype: ${mimetype}`);
            cb(new Error('Only video files (mp4, mov, avi, mkv) and archive files (zip, rar) are allowed!'));
        }
    },
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    console.log('Uploaded file URL:', fileUrl);
    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
});

app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error downloading file' });
            }
        });
    } else {
        res.status(404).json({ message: 'File not found' });
    }
});

app.get('/api/files', (req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading files' });
        }
        const fileList = files.map(file => ({
            name: file,
            url: `http://localhost:${PORT}/uploads/${file}`,
        }));
        res.json(fileList);
    });
});

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
