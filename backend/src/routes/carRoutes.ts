import express, { Request, Response } from 'express';
import Car from '../model/car';
import { carSchema, carUpdateSchema } from '../validation/carValidation';
import { Console } from 'console';
import { SortField } from '../model/types';

const router = express.Router();

let cars: Car[] = [
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
    image_url: 'https://www.shop4tesla.com/cdn/shop/articles/tesla-model-3-uber-230000-km-und-tausende-euro-gespart-956682.jpg?format=pjpg&pad_color=ffffff&v=1728598029&width=1920',
    },
    {
    id: 3,
    manufacturer: 'Ford',
    model: 'Mustang',
    year: 2019,
    price: 35000,
    image_url: 'https://www.topgear.com/sites/default/files/cars-car/image/2024/12/54196859052_9249719e93_o.jpg?w=1280&h=720',
    },
    {
    id: 4,
    manufacturer: 'BMW',
    model: 'X5',
    year: 2021,
    price: 58000,
    image_url: 'https://static.automarket.ro/img/auto_resized/db/article/112/947/802497l-1000x640-b-01f4b449.jpg',
    },
    {
    id: 5,
    manufacturer: 'Audi',
    model: 'A4',
    year: 2022,
    price: 39000,
    image_url: 'https://www.topgear.com/sites/default/files/cars-car/image/2021/03/audiuk0002282120audi20a420saloon.jpg',
    },
    {
    id: 6,
    manufacturer: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 42000,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-h4fyw_WSF0fQTPELrZaRaQOpxaBSXBjZPQ&s',
    },
    {
    id: 7,
    manufacturer: 'Volkswagen',
    model: 'Golf GTI',
    year: 2020,
    price: 23000,
    image_url: 'https://www.topgear.com/sites/default/files/2024/08/Golf_GTI_032.jpg',
    },
    {
    id: 8,
    manufacturer: 'Porsche',
    model: '911 Carrera',
    year: 2023,
    price: 99000,
    image_url: 'https://issimi-vehicles-cdn.b-cdn.net/publicamlvehiclemanagement/VehicleDetails/662/timestamped-1729570000535-1-2024-Porsche-911-Carrera-S-214888.jpg?width=3840&quality=75',
    },
];
let nextId = 2;

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

export default router