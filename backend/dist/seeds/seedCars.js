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
exports.default = seedCars;
require("reflect-metadata");
const database_1 = __importDefault(require("../config/database"));
const Car_1 = require("../model/Car");
const faker_1 = require("@faker-js/faker");
function seedCars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.initialize();
            const carRepository = database_1.default.getRepository(Car_1.Car);
            //delete all cars
            yield carRepository.clear();
            const BATCH_SIZE = 10;
            const TOTAL_CARS = 100;
            for (let i = 0; i < TOTAL_CARS / BATCH_SIZE; i++) {
                const cars = [];
                for (let j = 0; j < BATCH_SIZE; j++) {
                    const car = new Car_1.Car();
                    car.manufacturer = faker_1.faker.vehicle.manufacturer();
                    car.model = faker_1.faker.vehicle.model();
                    car.year = faker_1.faker.number.int({ min: 1990, max: 2024 });
                    car.price = faker_1.faker.number.int({ min: 5000, max: 100000 });
                    car.dealership_id = faker_1.faker.number.int({ min: 1, max: 2 });
                    car.image_url = "https://i.ytimg.com/vi/PAQhcKG9D6c/maxresdefault.jpg";
                    cars.push(car);
                }
                yield carRepository.save(cars);
                console.log(`Inserted batch ${i + 1}`);
            }
            console.log('Seeding complete!');
            process.exit(0);
        }
        catch (error) {
            console.error('Seeding failed:', error);
            process.exit(1);
        }
    });
}
