import { Request, Response } from 'express';
import AppDataSource from '../config/database';
import { Car } from '../model/Car';
import { Like, Between, FindOptionsWhere, Brackets } from 'typeorm';
import { logUserAction } from '../utils/logService';

const carRepository = AppDataSource.getRepository(Car);

export class CarController {
    // Create a new car
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const car = carRepository.create(req.body);
            const result = await carRepository.save(car);
            await logUserAction((req as any).user, 'CREATE_CAR', `Car ID: ${result[0]?.id}`);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error creating car' });
        }
    }

    // Get all cars with filtering and sorting
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                manufacturer,
                model,
                searchTerm,
                sortBy = 'id',
                order = 'ASC',
                selectedDealershipId
            } = req.query;

            const validSortFields = ['manufacturer', 'model', 'year', 'price', 'id'];
            const sortField = validSortFields.includes(String(sortBy)) ? String(sortBy) : 'id';
            const sortOrder = ['ASC', 'DESC'].includes(String(order).toUpperCase()) ? String(order).toUpperCase() : 'ASC';

            const query = carRepository
                .createQueryBuilder('car')
                .leftJoinAndSelect('car.dealership', 'dealership');

            if (searchTerm) {
                const search = `%${searchTerm}%`;
                query.andWhere(new Brackets(qb => {
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

            query.orderBy(`car.${sortField}`, sortOrder as 'ASC' | 'DESC');

            const cars = await query.getMany();

            res.json(cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            res.status(500).json({ error: 'Error fetching cars' });
        }
    };

    // Get a single car by ID
    getOne = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid car ID' });
                return;
            }

            const car = await carRepository.findOne({
                where: { id },
                relations: ['dealership']
            });
            
            if (!car) {
                res.status(404).json({ error: 'Car not found' });
                return;
            }
            
            res.json(car);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching car' });
        }
    }

    // Update a car
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid car ID' });
                return;
            }

            const car = await carRepository.findOne({
                where: { id }
            });
            
            if (!car) {
                res.status(404).json({ error: 'Car not found' });
                return;
            }

            carRepository.merge(car, req.body);
            const result = await carRepository.save(car);
            await logUserAction((req as any).user, 'UPDATE_CAR', `Car ID: ${id}`);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Error updating car' });
        }
    }

    // Delete a car
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid car ID' });
                return;
            }

            const car = await carRepository.findOne({
                where: { id }
            });
            
            if (!car) {
                res.status(404).json({ error: 'Car not found' });
                return;
            }

            await carRepository.remove(car);
            await logUserAction((req as any).user, 'DELETE_CAR', `Car ID: ${id}`);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting car' });
        }
    }

    public async getStats(req: Request, res: Response): Promise<void> {
        try {
            const cars = await carRepository.find();
            
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
            const avgPrice = Math.floor(prices.reduce((sum, price) => sum + price, 0) / prices.length);

            res.json({
                minPrice,
                maxPrice,
                avgPrice
            });
        } catch (error) {
            console.error('Error getting car stats:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
} 