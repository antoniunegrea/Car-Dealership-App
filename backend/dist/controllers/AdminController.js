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
exports.AdminController = void 0;
const database_1 = __importDefault(require("../config/database"));
const UserMonitoring_1 = __importDefault(require("../model/UserMonitoring"));
const userMonitoringRepo = database_1.default.getRepository(UserMonitoring_1.default);
class AdminController {
    constructor() {
        this.getMonitoredUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield userMonitoringRepo.find({
                relations: ['user']
            });
            res.json(users);
        });
    }
}
exports.AdminController = AdminController;
