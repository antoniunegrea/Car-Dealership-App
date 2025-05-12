import React, { useState, useEffect } from 'react';
import Car from '../model/Car';
import { useNavigate } from 'react-router-dom';
import '../styles/addCar.css'
import DealershipService from '../service/dealershipService';
import type Dealership from '../model/Dealership';

interface AddCarProps {
  onAddCar: (car: Omit<Car, 'id'>) => void;
  dealershipService: DealershipService;
}

const AddCarPage: React.FC<AddCarProps> = ({ onAddCar, dealershipService }) => {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [dealershipId, setDealershipId] = useState<number | ''>('');
  const [dealerships, setDealerships] = useState<Dealership[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        const data = await dealershipService.getAll();
        setDealerships(data);
        if (data.length > 0) setDealershipId(data[0].id);
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
    if (!dealershipId) return;
    onAddCar({
      manufacturer,
      model,
      year,
      price,
      image_url: imageUrl || null,
      dealership_id: dealershipId,
    });

    setManufacturer('');
    setModel('');
    setYear(2025);
    setPrice(0);
    setImageUrl('');
    setDealershipId(dealerships.length > 0 ? dealerships[0].id : '');
  };

  return (
    <div className="add-car-container">
      <button onClick={handleGoBack} className="go-back-button">Go Back</button>
      <form onSubmit={handleSubmit} className="add-car-form">
        <h2>Add a Car</h2>

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

        <button type="submit">Add Car</button>
      </form>
    </div> 
  );
};

export default AddCarPage;
