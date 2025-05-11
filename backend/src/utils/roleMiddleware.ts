import { Request, Response, NextFunction } from 'express';

// Usage: roleMiddleware(['admin'])
export function roleMiddleware(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Assume req.user is set by authentication middleware
        const user = (req as any).user as { role?: string } | undefined;
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        next();
    };
} 