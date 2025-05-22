import { useNavigate } from 'react-router-dom';
import Dealership from '../model/Dealership'
import { useEffect, useState } from 'react';

interface DealershipListProps {
    dealerships: Dealership[];
    onDelete: (dealershipId: number) => void;
    selectedDealershipId: number | null;
    setSelectedDealershipId: (dealershipId: number | null) => void;
}

const DealershipListComponent:React.FC<DealershipListProps> = ({dealerships, onDelete, selectedDealershipId, setSelectedDealershipId}) => {
    const navigate = useNavigate();

    const [visibleCount, setVisibleCount] = useState(10);
    const incrementCount = 5; 
    
    const displayedDealerships = dealerships.slice(0, visibleCount);

    useEffect(() => {
        const handleScroll = () => {
          const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      
          if (nearBottom && visibleCount < dealerships.length) {
            setVisibleCount(prev => Math.min(prev + incrementCount, dealerships.length));
          }
        };
      
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, [visibleCount, dealerships.length]);

    const handleDelete = (dealershipId: number) =>{
        const confirmDelete = window.confirm('Are you sure you want to delete this dealership?');
      if (confirmDelete) {
        onDelete(dealershipId);
      }
    }

    const handleDealershipClick = (dealershipId: number) => {
        setSelectedDealershipId(dealershipId);
        navigate('/cars');
    }

    return (
        <div className="dealership-list">
        {displayedDealerships.map((dealership) => (
            <div key={dealership.id} className="dealership-item">
            <div className="dealership-info">
                <h3 style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
                    onClick={() => handleDealershipClick(dealership.id)}>
                    {dealership.name}
                </h3>
                <p>Address: {dealership.location}</p>
                <p>Phone: {dealership.contact}</p>
            </div>  
            <div className="car-actions">
                <button onClick={() => navigate(`/dealerships/edit/${dealership.id}`)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(dealership.id)} className="delete-btn">Delete</button>
            </div>
            </div>
        ))}
        </div>
    );
};

export default DealershipListComponent;
