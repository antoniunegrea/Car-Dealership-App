import request from 'supertest';
import express from 'express';
import carRoutes from '../routes/carRoutes';
import Car from '../model/car';
import { cars, nextId } from '../routes/carRoutes';

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/cars', carRoutes);

describe('Car API Endpoints', () => {
    // Initial state for resetting
    const initialCars: Car[] = [
        {
            id: 1,
            manufacturer: 'Toyota',
            model: 'Corolla',
            year: 2020,
            price: 18000,
            image_url: 'https://scene7.toyota.eu/is/image/toyotaeurope/Corolla+HB+2:Large-Landscape?ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0'
        },
        {
            id: 2,
            manufacturer: 'Tesla',
            model: 'Model 3',
            year: 2023,
            price: 40000,
            image_url: 'https://www.shop4tesla.com/cdn/shop/articles/tesla-model-3-uber-230000-km-und-tausende-euro-gespart-956682.jpg?format=pjpg&pad_color=ffffff&v=1728598029&width=1920'
        }
    ];

    // Reset the cars array and nextId before each test
    beforeEach(() => {
        cars.length = 0; // Clear the array
        cars.push(...initialCars); // Reset to initial state
        (nextId as number) = 3; // Reset nextId (cast to avoid readonly error)
    });

    // GET Tests
    describe('GET /api/cars', () => {
        it('should return all cars', async () => {
            const res = await request(app).get('/api/cars');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].manufacturer).toBe('Toyota');
        });

        it('should filter cars by searchTerm', async () => {
            const res = await request(app).get('/api/cars?searchTerm=tesla');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].manufacturer).toBe('Tesla');
        });

        it('should sort cars by price in ascending order', async () => {
            const res = await request(app).get('/api/cars?sortBy=price&order=asc');
            expect(res.status).toBe(200);
            expect(res.body[0].price).toBe(18000); // Toyota first
            expect(res.body[1].price).toBe(40000); // Tesla second
        });

        it('should sort cars by year in descending order', async () => {
            const res = await request(app).get('/api/cars?sortBy=year&order=desc');
            expect(res.status).toBe(200);
            expect(res.body[0].year).toBe(2023); // Tesla first
            expect(res.body[1].year).toBe(2020); // Toyota second
        });
    });
    describe('POST /api/cars', () => {
        it('should add a new car', async () => {
            const newCar = {
                manufacturer: 'Honda',
                model: 'Civic',
                year: 2021,
                price: 20000,
                image_url: 'https://example.com/honda.jpg'
            };
            const res = await request(app)
                .post('/api/cars')
                .send(newCar)
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(3);
            expect(res.body.manufacturer).toBe('Honda');
            expect(cars).toHaveLength(3);
        });

        it('should return 400 for invalid data', async () => {
            const invalidCar = {
                manufacturer: 'H', // Too short
                model: 'Civic',
                year: 2021,
                price: 20000,
                image_url: 'https://example.com/honda.jpg'
            };
            const res = await request(app)
                .post('/api/cars')
                .send(invalidCar)
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(400);
            expect(res.body.message).toBeDefined();
        });
    });

    // PATCH Tests
    describe('PATCH /api/cars/:id', () => {
        it('should update an existing car', async () => {
            const updateData = { price: 19000 };
            const res = await request(app)
                .patch('/api/cars/1')
                .send(updateData)
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body.price).toBe(19000);
            expect(res.body.manufacturer).toBe('Toyota');
        });

        it('should return 404 for non-existent car', async () => {
            const res = await request(app)
                .patch('/api/cars/999')
                .send({ price: 20000 })
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Car not found');
        });

        it('should return 400 for invalid update data', async () => {
            const invalidUpdate = { manufacturer: 'A' }; // Too short
            const res = await request(app)
                .patch('/api/cars/1')
                .send(invalidUpdate)
                .set('Content-Type', 'application/json');
            expect(res.status).toBe(400);
            expect(res.body.message).toBeDefined();
        });
    });

    // DELETE Tests
    describe('DELETE /api/cars/:id', () => {
        it('should delete an existing car', async () => {
            const res = await request(app).delete('/api/cars/1');
            expect(res.status).toBe(204);
            expect(cars).toHaveLength(1);
            expect(cars[0].id).toBe(2); // Toyota should be gone
        });

        it('should return 404 for non-existent car', async () => {
            const res = await request(app).delete('/api/cars/999');
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Car not found');
        });
    });
});