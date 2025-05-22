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
exports.DealershipController = void 0;
const database_1 = __importDefault(require("../config/database"));
const Dealership_1 = require("../model/Dealership");
const typeorm_1 = require("typeorm");
const logService_1 = require("../utils/logService");
const dealershipRepository = database_1.default.getRepository(Dealership_1.Dealership);
class DealershipController {
    constructor() {
        // Create a new dealership
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const dealership = dealershipRepository.create(req.body);
                const result = yield dealershipRepository.save(dealership);
                yield (0, logService_1.logUserAction)(req.user, 'CREATE_DEALERSHIP', `Dealership ID: ${(_a = result[0]) === null || _a === void 0 ? void 0 : _a.id}`);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating dealership' });
                console.log("Error creating dealership: " + error);
            }
        });
        // Get all dealerships with filtering
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchTerm, sortBy, order, selectedDealershipId } = req.query;
                const where = [];
                if (searchTerm) {
                    where.push({
                        name: (0, typeorm_1.ILike)(`%${searchTerm}%`)
                    });
                    where.push({
                        location: (0, typeorm_1.ILike)(`%${searchTerm}%`)
                    });
                }
                const dealerships = yield dealershipRepository.find({
                    where: searchTerm ? where : {},
                    order: { [sortBy]: order },
                    relations: ['cars']
                });
                res.json(dealerships);
            }
            catch (error) {
                console.error('Error fetching dealerships:', error);
                res.status(500).json({ error: 'Error fetching dealerships' });
            }
        });
        // Get a single dealership by ID
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid dealership ID' });
                    return;
                }
                const dealership = yield dealershipRepository.findOne({
                    where: { id },
                    relations: ['cars']
                });
                if (!dealership) {
                    res.status(404).json({ error: 'Dealership not found' });
                    return;
                }
                res.json(dealership);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching dealership' });
            }
        });
        // Update a dealership
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid dealership ID' });
                    return;
                }
                const dealership = yield dealershipRepository.findOne({
                    where: { id }
                });
                if (!dealership) {
                    res.status(404).json({ error: 'Dealership not found' });
                    return;
                }
                dealershipRepository.merge(dealership, req.body);
                const result = yield dealershipRepository.save(dealership);
                yield (0, logService_1.logUserAction)(req.user, 'UPDATE_DEALERSHIP', `Dealership ID: ${id}`);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating dealership' });
            }
        });
        // Delete a dealership
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid dealership ID' });
                    return;
                }
                const dealership = yield dealershipRepository.findOne({
                    where: { id }
                });
                if (!dealership) {
                    res.status(404).json({ error: 'Dealership not found' });
                    return;
                }
                yield dealershipRepository.remove(dealership);
                yield (0, logService_1.logUserAction)(req.user, 'DELETE_DEALERSHIP', `Dealership ID: ${id}`);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting dealership' });
            }
        });
    }
}
exports.DealershipController = DealershipController;
