import 'reflect-metadata';
import AppDataSource from '../config/database';
import { Car } from '../model/Car';
import { faker } from '@faker-js/faker';

export default async function seedCars() {
  try {
    await AppDataSource.initialize();
    const carRepository = AppDataSource.getRepository(Car);

    //delete all cars
    await carRepository.clear();

    const BATCH_SIZE = 10;
    const TOTAL_CARS = 100;

    for (let i = 0; i < TOTAL_CARS / BATCH_SIZE; i++) {
      const cars: Car[] = [];

      for (let j = 0; j < BATCH_SIZE; j++) {
        const car = new Car();
        car.manufacturer = faker.vehicle.manufacturer();
        car.model = faker.vehicle.model();
        car.year = faker.number.int({ min: 1990, max: 2024 });
        car.price = faker.number.int({ min: 5000, max: 100000 });
        car.dealership_id = faker.number.int({ min: 1, max: 2 });
        car.image_url = "https://i.ytimg.com/vi/PAQhcKG9D6c/maxresdefault.jpg"
        cars.push(car);
      }

      await carRepository.save(cars);
      console.log(`Inserted batch ${i + 1}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

