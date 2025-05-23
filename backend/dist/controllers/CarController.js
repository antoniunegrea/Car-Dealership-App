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
exports.CarController = void 0;
const database_1 = __importDefault(require("../config/database"));
const Car_1 = require("../model/Car");
const typeorm_1 = require("typeorm");
const logService_1 = require("../utils/logService");
const carRepository = database_1.default.getRepository(Car_1.Car);
class CarController {
    constructor() {
        // Create a new car
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const car = carRepository.create(req.body);
                const result = yield carRepository.save(car);
                yield (0, logService_1.logUserAction)(req.user, 'CREATE_CAR', `Car ID: ${(_a = result[0]) === null || _a === void 0 ? void 0 : _a.id}`);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error creating car' });
            }
        });
        // Get all cars with filtering and sorting
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { manufacturer, model, searchTerm, sortBy = 'id', order = 'ASC', selectedDealershipId } = req.query;
                const validSortFields = ['manufacturer', 'model', 'year', 'price', 'id'];
                const sortField = validSortFields.includes(String(sortBy)) ? String(sortBy) : 'id';
                const sortOrder = ['ASC', 'DESC'].includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'ASC';
                const query = carRepository
                    .createQueryBuilder('car')
                    .leftJoinAndSelect('car.dealership', 'dealership');
                if (searchTerm) {
                    const search = `%${searchTerm}%`;
                    query.andWhere(new typeorm_1.Brackets(qb => {
                        qb.where('LOWER(car.manufacturer) LIKE LOWER(:search)', { search })
                            .orWhere('LOWER(car.model) LIKE LOWER(:search)', { search })
                            .orWhere('CAST(car.year AS TEXT) LIKE :search', { search })
                            .orWhere('CAST(car.price AS TEXT) LIKE :search', { search });
                    }));
                }
                if (manufacturer) {
                    query.andWhere('LOWER(car.manufacturer) LIKE LOWER(:manufacturer)', { manufacturer: `%${manufacturer}%` });
                }
                if (model) {
                    query.andWhere('LOWER(car.model) LIKE LOWER(:model)', { model: `%${model}%` });
                }
                if (selectedDealershipId && !isNaN(Number(selectedDealershipId))) {
                    query.andWhere('car.dealership_id = :dealershipId', { dealershipId: Number(selectedDealershipId) });
                }
                query.orderBy(`car.${sortField}`, sortOrder);
                const cars = yield query.getMany();
                res.json(cars);
            }
            catch (error) {
                console.error('Error fetching cars:', error);
                res.status(500).json({ error: 'Error fetching cars' });
            }
        });
        // Get a single car by ID
        this.getOne = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid car ID' });
                    return;
                }
                const car = yield carRepository.findOne({
                    where: { id },
                    relations: ['dealership']
                });
                if (!car) {
                    res.status(404).json({ error: 'Car not found' });
                    return;
                }
                res.json(car);
            }
            catch (error) {
                res.status(500).json({ error: 'Error fetching car' });
            }
        });
        // Update a car
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid car ID' });
                    return;
                }
                const car = yield carRepository.findOne({
                    where: { id }
                });
                if (!car) {
                    res.status(404).json({ error: 'Car not found' });
                    return;
                }
                carRepository.merge(car, req.body);
                const result = yield carRepository.save(car);
                yield (0, logService_1.logUserAction)(req.user, 'UPDATE_CAR', `Car ID: ${id}`);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Error updating car' });
            }
        });
        // Delete a car
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ error: 'Invalid car ID' });
                    return;
                }
                const car = yield carRepository.findOne({
                    where: { id }
                });
                if (!car) {
                    res.status(404).json({ error: 'Car not found' });
                    return;
                }
                yield carRepository.remove(car);
                yield (0, logService_1.logUserAction)(req.user, 'DELETE_CAR', `Car ID: ${id}`);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Error deleting car' });
            }
        });
    }
    getStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cars = yield carRepository.find();
                if (cars.length === 0) {
                    res.json({
                        minPrice: 0,
                        maxPrice: 0,
                        avgPrice: 0
                    });
                    return;
                }
                const prices = cars.map(car => car.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const avgPrice = minPrice + maxPrice / 2;
                res.json({
                    minPrice,
                    maxPrice,
                    avgPrice,
                });
            }
            catch (error) {
                console.error('Error getting car stats:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.CarController = CarController;
