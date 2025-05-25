import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/editCar.css'
import type Dealership from '../model/Dealership';

interface EditDealershipProps {
  dealerships: Dealership[];
  onEditDealership: (dealership: Dealership) => void;
}

const EditDealershipPage: React.FC<EditDealershipProps> = ( {dealerships, onEditDealership }) => {
    const { id } = useParams<{ id?: string }>();
    const dealershipId = id ? parseInt(id) : 0;
    const dealershipToEdit = dealerships.find((dealership) => dealership.id === dealershipId);
    
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');

    useEffect(() => {
        if (dealershipToEdit) {
            setName(dealershipToEdit.name);
            setLocation(dealershipToEdit.location);
            setContact(dealershipToEdit.contact);
        }
    }, [dealershipToEdit]);

    

    const navigate = useNavigate();

    if (!dealershipToEdit) {
      return <div>Dealership not found</div>;
    }

    const handleGoBack = () => {
        navigate('/dealerships');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onEditDealership({id: dealershipId, name, location, contact});
    };

  return (
    <div className="edit-dealership-container">
      <button onClick={handleGoBack} className="go-back-button">Go Back</button>
      <form onSubmit={handleSubmit} className="edit-dealership-form">
        <h2>Edit a Dealership</h2>

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

        <label>Contact</label>
        <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />

        <button type="submit">Edit Dealership</button>
      </form>
    </div>
  );
};

export default EditDealershipPage;
