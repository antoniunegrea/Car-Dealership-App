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
exports.AuthController = void 0;
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logService_1 = require("../utils/logService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const SALT_ROUNDS = 10;
const userRepo = database_1.default.getRepository(User_1.default);
class AuthController {
    constructor() {
        // login
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password } = req.body;
            const user = yield userRepo.findOne({ where: { username } });
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isValidPassword) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
            yield (0, logService_1.logUserAction)(user, 'LOGIN', `User ${user.username} logged in`);
            res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
        });
        // register
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, password, role } = req.body;
            const existingUser = yield userRepo.findOne({ where: { username } });
            if (existingUser) {
                res.status(400).json({ error: 'Username already exists' });
                return;
            }
            // Hash the password before saving
            const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            const user = userRepo.create({ username, password: hashedPassword, role });
            yield userRepo.save(user);
            yield (0, logService_1.logUserAction)(user, 'REGISTER', `User ${user.username} registered`);
            res.json(user);
        });
    }
}
exports.AuthController = AuthController;
