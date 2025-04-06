import React, { useState } from 'react';
import Car from '../model/Car';
import { useNavigate } from 'react-router-dom';
import '../styles/addCar.css'

interface AddCarProps {
  onAddCar: (car: Omit<Car, 'id'>) => void;
}

const AddCarPage: React.FC<AddCarProps> = ({ onAddCar }) => {
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2023);
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCar({
      manufacturer,
      model,
      year,
      price,
      image_url: imageUrl || null,
    });

    setManufacturer('');
    setModel('');
    setYear(2025);
    setPrice(0);
    setImageUrl('');
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

        <button type="submit">Add Car</button>
      </form>
    </div> 
  );
};

export default AddCarPage;
