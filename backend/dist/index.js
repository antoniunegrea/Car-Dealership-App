"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
//import runDaemonThread from './utils/daemonThread';
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Car_1 = require("./model/Car");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const monitorUserActions_1 = require("./utils/monitorUserActions");
//import seedCars from './seeds/seedCars';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const INTERVAL_MINUTES = 3 * 60 * 1000; // Y minutes
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/cars', car_routes_1.default);
app.use('/api/dealerships', dealership_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
app.use('/api/stats', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield database_1.default.getRepository(Car_1.Car)
            .createQueryBuilder('car')
            .select('car.manufacturer', 'manufacturer')
            .addSelect('AVG(car.price)', 'averagePrice')
            .groupBy('car.manufacturer')
            .orderBy('AVG(car.price)', 'DESC')
            .getRawMany();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//seed cars
//seedCars();
//start activity generator
//startLoginGenerator();
//run daemon thred to add random cars
//runDaemonThread(app);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10000 * 1024 * 1024 }, // Limit to 10000MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /mp4|mov|avi|mkv|zip|rar/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
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
        }
        else {
            console.log(`Rejected file: ${file.originalname}, extname: ${extname}, mimetype: ${mimetype}`);
            cb(new Error('Only video files (mp4, mov, avi, mkv) and archive files (zip, rar) are allowed!'));
        }
    },
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
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
    const filePath = path_1.default.join(__dirname, 'uploads', filename);
    if (fs_1.default.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error downloading file' });
            }
        });
    }
    else {
        res.status(404).json({ message: 'File not found' });
    }
});
app.get('/api/files', (req, res) => {
    fs_1.default.readdir('uploads/', (err, files) => {
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
