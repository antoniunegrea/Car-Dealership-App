import React, { useState, useEffect } from 'react';
import Car from '../model/Car';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/editCar.css'
import DealershipService from '../service/dealershipService';
import type Dealership from '../model/Dealership';

interface EditCarProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
  dealershipService: DealershipService;
}

const EditCarPage: React.FC<EditCarProps> = ( {cars, onEditCar, dealershipService }) => {
    const { id } = useParams<{ id?: string }>();
    const carId = id ? parseInt(id) : 0;
    const carToEdit = cars.filter((car)=> car.id === carId)[0];
    const [manufacturer, setManufacturer] = useState(carToEdit.manufacturer);
    const [model, setModel] = useState(carToEdit.model);
    const [year, setYear] = useState<number>(Number(carToEdit.year));
    const [price, setPrice] = useState<number>(Number(carToEdit.price));
    const [imageUrl, setImageUrl] = useState<string>(carToEdit.image_url || '');
    const [dealershipId, setDealershipId] = useState<number>(carToEdit.dealership_id);
    const [dealerships, setDealerships] = useState<Dealership[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDealerships = async () => {
            try {
                const data = await dealershipService.getAll();
                setDealerships(data);
            } catch (error) {
                console.error('Failed to fetch dealerships:', error);
            }
        };
        fetchDealerships();
    }, []);

    const handleGoBack = () => {
        navigate('/cars');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEditCar({id: carId, manufacturer,model,year,price,image_url: imageUrl,dealership_id: dealershipId});
    };

  return (
    <div className="edit-car-container">
      <button onClick={handleGoBack} className="go-back-button">Go Back</button>
      <form onSubmit={handleSubmit} className="edit-car-form">
        <h2>Edit a Car</h2>

        <label>Manufacturer</label>
        <input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required />

        <label>Model</label>
        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />

        <label>Year</label>
        <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} required />

        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />

        <label>Image URL</label>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

        <label>Dealership</label>
        <select value={dealershipId} onChange={e => setDealershipId(Number(e.target.value))} required>
          <option value="" disabled>Select a dealership</option>
          {dealerships.map(ds => (
            <option key={ds.id} value={ds.id}>{ds.name}</option>
          ))}
        </select>

        <button type="submit">Edit Car</button>
      </form>
    </div>
  );
};

export default EditCarPage;
