import React, { useState } from 'react';
import Car from '../model/Car';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/editCar.css'

interface EditCarProps {
  cars: Car[];
  onEditCar: (car: Car) => void;
}

const EditCarPage: React.FC<EditCarProps> = ( {cars, onEditCar }) => {
    const { id } = useParams<{ id?: string }>();
    const carId = id ? parseInt(id) : 0;
    console.log('Editing car with ID:', id);
    const carToEdit = cars[carId-1];
    const [manufacturer, setManufacturer] = useState(carToEdit.manufacturer);
    const [model, setModel] = useState(carToEdit.model);
    const [year, setYear] = useState<number>(Number(carToEdit.year));
    const [price, setPrice] = useState<number>(Number(carToEdit.year));
    const [imageUrl, setImageUrl] = useState<string>(carToEdit.image_url || '');

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEditCar({id: carId, manufacturer,model,year,price,image_url: imageUrl});

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

        <button type="submit">Edit Car</button>
      </form>
    </div>
  );
};

export default EditCarPage;
