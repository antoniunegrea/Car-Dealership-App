import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Car } from '../model/Car';
import { Like, Between, FindOptionsWhere } from 'typeorm';

const carRepository = AppDataSource.getRepository(Car);

export class CarController {
    // Create a new car
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const car = carRepository.create(req.body);
            const result = await carRepository.save(car);
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
                minYear,
                maxYear,
                minPrice,
                maxPrice,
                dealership_id,
                searchTerm,
                sortBy = 'id',
                order = 'ASC'
            } = req.query;

            const where: FindOptionsWhere<Car> = {};

            if (searchTerm) {
                const search = `%${searchTerm}%`;
                // Only allow sorting by specific fields
                const validSortFields = ['manufacturer', 'model', 'year', 'price', 'id'];
                const sortField = validSortFields.includes(String(sortBy)) ? String(sortBy) : 'id';
                const sortOrder = (order === 'ASC' || order === 'DESC' || order === 'asc' || order === 'desc') ? order.toUpperCase() : 'ASC';

                console.log('QueryBuilder search:', { sortField, sortOrder });

                const cars = await carRepository
                    .createQueryBuilder('car')
                    .where('LOWER(car.manufacturer) LIKE LOWER(:search)', { search })
                    .orWhere('LOWER(car.model) LIKE LOWER(:search)', { search })
                    .orWhere('car.year::text LIKE :search', { search })
                    .orWhere('car.price::text LIKE :search', { search })
                    .orderBy(`car.${sortField}`, sortOrder as 'ASC' | 'DESC')
                    .getMany();
                
                res.json(cars);
                return;
            }

            if (manufacturer) where.manufacturer = Like(`%${manufacturer}%`);
            if (model) where.model = Like(`%${model}%`);
            if (dealership_id) {
                const dealershipId = Number(dealership_id);
                if (!isNaN(dealershipId)) {
                    where.dealership_id = dealershipId;
                }
            }
            
            if (minYear || maxYear) {
                const min = minYear ? Number(minYear) : 1900;
                const max = maxYear ? Number(maxYear) : new Date().getFullYear();
                if (!isNaN(min) && !isNaN(max)) {
                    where.year = Between(min, max);
                }
            }

            if (minPrice || maxPrice) {
                const min = minPrice ? Number(minPrice) : 0;
                const max = maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;
                if (!isNaN(min) && !isNaN(max)) {
                    where.price = Between(min, max);
                }
            }

            const cars = await carRepository.find({
                where,
                order: { [sortBy as string]: order },
                relations: ['dealership']
            });

            res.json(cars);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching cars' });
        }
    }

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
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting car' });
        }
    }
} 