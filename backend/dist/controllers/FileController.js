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
exports.FileController = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileController {
    constructor(port) {
        this.PORT = port;
        this.upload = this.configureMulter();
    }
    configureMulter() {
        const storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
            },
        });
        return (0, multer_1.default)({
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
    }
    getUploadMiddleware() {
        return this.upload.single('file');
    }
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            const protocol = req.protocol;
            const host = req.get('host');
            const fileUrl = `${protocol}://${host}/api/files/uploads/${req.file.filename}`;
            console.log('Uploaded file URL:', fileUrl);
            res.status(200).json({ message: 'File uploaded successfully', fileUrl });
        });
    }
    downloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
    }
    listFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.readdir('uploads/', (err, files) => {
                if (err) {
                    return res.status(500).json({ message: 'Error reading files' });
                }
                const protocol = req.protocol;
                const host = req.get('host');
                const fileList = files.map(file => ({
                    name: file,
                    url: `${protocol}://${host}/uploads/${file}`,
                }));
                res.json(fileList);
            });
        });
    }
}
exports.FileController = FileController;
