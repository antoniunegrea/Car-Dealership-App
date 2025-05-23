import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class FileController {
    private upload: multer.Multer;
    private PORT: number;

    constructor(port: number) {
        this.PORT = port;
        this.upload = this.configureMulter();
    }

    private configureMulter(): multer.Multer {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads/');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
            },
        });

        return multer({
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
    }

    public getUploadMiddleware() {
        return this.upload.single('file');
    }

    public async uploadFile(req: Request, res: Response): Promise<void> {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        console.log('Uploaded file URL:', fileUrl);
        res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    }

    public async downloadFile(req: Request, res: Response): Promise<void> {
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
    }

    public async listFiles(req: Request, res: Response): Promise<void> {
        fs.readdir('uploads/', (err, files) => {
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
    }
} 