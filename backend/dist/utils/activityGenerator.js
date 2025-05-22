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
exports.startLoginGenerator = startLoginGenerator;
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = 'http://localhost:3000/api/auth/login';
const USERNAME = 'Toni';
const PASSWORD = 'user';
const ACTIONS_TO_LOG = 10;
const INTERVAL_MS = 2000; // 2 seconds
let actionCount = 0;
let intervalId;
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, node_fetch_1.default)(`${BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
        });
        if (!res.ok) {
            console.error('Login failed');
            return;
        }
        const data = yield res.json();
        console.log(`Login #${actionCount}: token=${data.token}`);
    });
}
function periodicLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('periodicLogin');
        actionCount++;
        yield login();
        if (actionCount >= ACTIONS_TO_LOG) {
            clearInterval(intervalId);
            console.log('Done logging in!');
        }
    });
}
function startLoginGenerator() {
    intervalId = setInterval(periodicLogin, INTERVAL_MS);
}
