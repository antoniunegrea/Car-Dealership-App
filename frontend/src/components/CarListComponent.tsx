import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Car from '../model/Car';
import CarService from '../service/CarService';
import '../styles/carList.css'

interface CarListProps {
    cars: Car[];
    onDelete: (id: number) => void;
    carService: CarService;
}

const CarListComponent: React.FC<CarListProps> = ({ cars, onDelete, carService }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ minPrice: 0, maxPrice: 0, avgPrice: 0 });
    const [visibleCount, setVisibleCount] = useState(10);
    const incrementCount = 5;

    const PRICE_ERROR = 300;
    
    const displayedCars = cars.slice(0, visibleCount);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await carService.getStats();
                setStats({
                    minPrice: statsData.minPrice,
                    maxPrice: statsData.maxPrice,
                    avgPrice: statsData.avgPrice
                });
            } catch (error) {
                console.error('Failed to fetch car stats:', error);
            }
        };

        fetchStats();
    }, [carService]);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
        
            if (nearBottom && visibleCount < cars.length) {
                setVisibleCount(prev => Math.min(prev + incrementCount, cars.length));
            }
        };
      
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visibleCount, cars.length]);

    const handleDelete = (carId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this car?');
        if (confirmDelete) {
            onDelete(carId);
        }
    };

    return (
        <div className="car-list">
            {displayedCars.map((car) => (
                <div key={car.id} className="car-item">
                    <img
                        src={car.image_url || 'https://via.placeholder.com/100'}
                        alt={`${car.manufacturer} ${car.model}`}
                        className="car-image"
                    />
                    <div className="car-info">
                        <h3>{car.manufacturer} {car.model}</h3>
                        <p>Year: {car.year}</p>
                        <p>Price: ${car.price.toLocaleString()}</p>
                    </div>
                    <div className='statistics' 
                        style={{
                            backgroundColor: 
                                Number(car.price) === stats.maxPrice ?
                                'lightcoral' :
                                Number(car.price) === stats.minPrice ?
                                'lightgreen' :
                                Math.abs(Number(car.price) - stats.avgPrice) < PRICE_ERROR ?
                                'lightblue' :
                                'transparent'
                        }}
                    >
                        {Number(car.price) === stats.maxPrice ?
                            'The most expensive car' :
                            Number(car.price) === stats.minPrice ?
                            'The cheapest car' :
                            Math.abs(Number(car.price) - stats.avgPrice) < PRICE_ERROR ?
                            'The average price car' :
                            ''}
                    </div>   
                    <div className="car-actions">
                        <button 
                            onClick={() => navigate(`/cars/edit/${car.id}`)} 
                            className="edit-btn"
                            aria-label={`Edit ${car.manufacturer} ${car.model}`}
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(car.id)} 
                            className="delete-btn"
                            aria-label={`Delete ${car.manufacturer} ${car.model}`}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarListComponent;
