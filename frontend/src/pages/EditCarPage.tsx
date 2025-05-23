import React, { useState, useEffect } from 'react';
import Car from '../model/Car';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/editCar.css';
import DealershipService from '../service/DealershipService';
import type Dealership from '../model/Dealership';

interface EditCarProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
  dealershipService: DealershipService;
}

const EditCarPage: React.FC<EditCarProps> = ({ cars, onEditCar, dealershipService }) => {
  const { id } = useParams<{ id?: string }>();
  const carId = id ? parseInt(id) : 0;
  const navigate = useNavigate();

  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [dealershipId, setDealershipId] = useState<number>(0);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);

  useEffect(() => {
    const selectedCar = cars.find((car) => car.id === carId);
    if (selectedCar) {
      setCarToEdit(selectedCar);
      setManufacturer(selectedCar.manufacturer);
      setModel(selectedCar.model);
      setYear(Number(selectedCar.year));
      setPrice(Number(selectedCar.price));
      setImageUrl(selectedCar.image_url || '');
      setDealershipId(selectedCar.dealership_id);
    }
  }, [cars, carId]);

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
  }, [dealershipService]);

  const handleGoBack = () => {
    navigate('/cars');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (carToEdit) {
      onEditCar({
        id: carToEdit.id,
        manufacturer,
        model,
        year,
        price,
        image_url: imageUrl,
        dealership_id: dealershipId
      });
    }
  };

  if (!carToEdit) {
    return <div>Car not found</div>;
  }

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
