import { Request, Response } from 'express';

export class ServerController {
    public healthCheck(req: Request, res: Response): void {
        res.status(200).json({ status: 'OK' });
    }
} 