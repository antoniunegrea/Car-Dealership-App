"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerController = void 0;
class ServerController {
    healthCheck(req, res) {
        res.status(200).json({ status: 'OK' });
    }
}
exports.ServerController = ServerController;
