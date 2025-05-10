import React, { useState, useEffect } from 'react';
import Car from '../model/Car';
import { useNavigate } from 'react-router-dom';
import '../styles/addCar.css'
import DealershipService from '../service/dealershipService';
import type Dealership from '../model/Dealership';

interface AddDealershipProps {
  onAddDealership: (dealership: Omit<Dealership, 'id'>) => void;
  dealershipService: DealershipService;
}

const AddDealershipPage: React.FC<AddDealershipProps> = ({ onAddDealership, dealershipService }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [dealerships, setDealerships] = useState<Dealership[]>([]);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDealership({
      name,
      location,
      contact,
    });

    setName('');
    setLocation('');
    setContact('');
  };

  return (
    <div className="add-dealership-container">
      <button onClick={handleGoBack} className="go-back-button">Go Back</button>
      <form onSubmit={handleSubmit} className="add-dealership-form">
        <h2>Add a Dealership</h2>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Contact</label>
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />

        <button type="submit">Add Dealership</button>
        </form>
    </div> 
  );
};

export default AddDealershipPage;
