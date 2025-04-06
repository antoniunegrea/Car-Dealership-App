import React, { useEffect, useState } from 'react';
import { Routes, Route,BrowserRouter } from "react-router-dom";
import Index from './pages/Index'
import AddCarPage from './pages/AddCarPage';
import './App.css';
import Car from './model/Car';
import EditCarPage from './pages/EditCarPage';
import CarService from './service/carService'
import { SortField, SortOrder } from './model/Types';

let nextId = 4;

function App() {
  /*
  const [cars, setCars] = useState<Car[]>([
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
  ]);
  */
  const [cars, setCars] = useState<Car[]>([]);

  const [sortField, setSortField] = useState<SortField>('manufacturer');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [searchTerm, setSearchTerm] = useState('');
  
  const carService = new CarService("http://localhost:3000/api/cars"); 

  useEffect(() => {
    // Fetch cars sorted by price in descending order
    carService.get({searchTerm: searchTerm, sortBy: sortField, order: sortOrder })
        .then((cars) => setCars(cars))
        .catch((error) => console.error('Failed to load sorted cars:', error));
  }, [searchTerm, sortField, sortOrder]);

  const handleAddCar = (newCar: Omit<Car, 'id'>) => {
    setCars((prev) => [...prev, { ...newCar, id: nextId++ }]);
  };

  const handleEdit = (car: Car) => {
    cars[car.id - 1] = car;
    console.log('Edit car with ID:', car.id);
  };
  
  const handleDelete = (id: number) => {
    console.log('Delete car with ID:', id);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index cars={cars} handleDelete={handleDelete} 
                                        sortField={sortField}
                                        setSortField={setSortField}
                                        sortOrder={sortOrder}
                                        setSortOrder={setSortOrder}
                                        searchTerm={searchTerm}
                                        setSearchTerm={setSearchTerm} />}></Route>
        <Route path='/add' element={<AddCarPage onAddCar={handleAddCar}/>}></Route>
        <Route path="/edit/:id" element={<EditCarPage cars={cars} onEditCar={handleEdit} />} />
        <Route
          path="*"
          element={<div style={{ padding: 20 }}>404 - Page Not Found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
