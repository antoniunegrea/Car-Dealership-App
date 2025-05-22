"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
// Usage: roleMiddleware(['admin'])
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
        // Assume req.user is set by authentication middleware
        const user = req.user;
        if (!user || !user.role || !allowedRoles.includes(user.role)) {
            res.status(403).json({ error: 'Forbidden: insufficient permissions' });
            return;
        }
        next();
    };
}
