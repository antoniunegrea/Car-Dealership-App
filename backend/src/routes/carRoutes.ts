import express, { Request, Response } from 'express';
import Car from '../model/car';
import { carSchema, carUpdateSchema } from '../validation/carValidation';
import { SortField } from '../model/types';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const carsPath = path.join(__dirname, '..', '..', 'entities', 'cars.json');

let carsList: Car[] = [];
let next: number = 0;
try {
    const data = fs.readFileSync(carsPath, 'utf-8');
    carsList = JSON.parse(data);
    // Set nextId to the highest ID + 1
    next = carsList.length > 0 ? Math.max(...carsList.map(car => car.id)) + 1 : 1;
} catch (err) {
    console.error('Failed to load cars data:', err);
    carsList = [];
    next = 1;
}

export let cars = carsList;

export let nextId = next;

router.get('/', (req: Request, res: Response) => {
    let result = [...cars];
    const { searchTerm } = req.query;
    if (searchTerm) {
        const search = (searchTerm as string).toLowerCase();
        result = result.filter(car => {
            return (
                car.manufacturer.toLowerCase().includes(search) ||
                car.model.toLowerCase().includes(search) ||
                car.year.toString().includes(search) ||
                car.price.toString().includes(search)
            );
        });
    }

    const sortBy = req.query.sortBy as SortField;
    const order = req.query.order === 'desc' ? -1 : 1;
    if (sortBy === 'price') {
        result.sort((a, b) => (a.price - b.price) * order);
    } else if (sortBy === 'year') {
        result.sort((a, b) => (a.year - b.year) * order);
    } else if (sortBy === 'manufacturer') {
        result.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer) * order);
    }

    res.json(result);
});

router.post('/', (req: Request, res: Response) => {
    const { error, value } = carSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }

    const newCar: Car = { id: nextId++, ...value };
    cars.push(newCar);
    res.status(201).json(newCar);
});

router.patch('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const carIndex = cars.findIndex(c => c.id === id);
    if (carIndex === -1) {
        res.status(404).json({ message: 'Car not found' });
        return;
    }

    const { error, value } = carUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
    }
    cars[carIndex] = { ...cars[carIndex], ...value };
    res.json(cars[carIndex]);
});

router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const carIndex = cars.findIndex(c => c.id === id);
    if (carIndex === -1) {
        res.status(404).json({ message: 'Car not found' });
        return;
    }

    cars.splice(carIndex, 1);
    res.status(204).send();
});

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


export default router;
