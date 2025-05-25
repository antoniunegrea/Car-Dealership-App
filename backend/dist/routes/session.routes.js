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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = (0, express_1.Router)();
const sessionController = new SessionController_1.SessionController();
// Session routes with error handling
router.post('/', authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Session creation route hit');
        yield sessionController.createSession(req, res);
    }
    catch (error) {
        console.error('Error in session creation:', error);
        next(error);
    }
}));
router.get('/', authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sessionController.getUserSessions(req, res);
    }
    catch (error) {
        console.error('Error getting user sessions:', error);
        next(error);
    }
}));
router.delete('/:sessionId', authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sessionController.invalidateSession(req, res);
    }
    catch (error) {
        console.error('Error invalidating session:', error);
        next(error);
    }
}));
router.patch('/:sessionId/activity', authMiddleware_1.authMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sessionController.updateSessionActivity(req, res);
    }
    catch (error) {
        console.error('Error updating session activity:', error);
        next(error);
    }
}));
exports.default = router;
