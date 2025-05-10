import { useNavigate } from 'react-router-dom';
import Car from '../model/Car'
import '../styles/carList.css'
import { useEffect, useState } from 'react';
import ReactPaginate from "react-paginate";

interface CarListProps {
    cars: Car[];
    onDelete: (carId: number) => void;
}

const CarListComponent:React.FC<CarListProps> = ({cars, onDelete}) => {
    const navigate = useNavigate();

    const [stats, setStats] = useState({minPrice: 0, maxPrice: 0, avgPrice: 0});
  
    const [visibleCount, setVisibleCount] = useState(10);
    const incrementCount = 5; 
    
    const displayedCars = cars.slice(0, visibleCount);

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

    const handleDelete = (carId: number) =>{
        const confirmDelete = window.confirm('Are you sure you want to delete this car?');
      if (confirmDelete) {
        onDelete(carId);
      }
    }
    
    useEffect(() => {
        if (cars.length === 0) {
          setStats({ minPrice: 0, maxPrice: 0, avgPrice: 0 });
          return;
        }
    
        const prices = cars.map(car => Number(car.price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = Math.floor(prices.reduce((sum, price) => sum + price, 0) / prices.length);
    
        setStats({ minPrice, maxPrice, avgPrice });
      }, [cars]);

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
                        Number(car.price) === stats.maxPrice?
                        'lightcoral':
                        Number(car.price) === stats.minPrice?
                        'lightgreen':
                        Math.abs(Number(car.price)-stats.avgPrice) < 100?
                        'lightblue':
                        'transparent',
                    }}
            >{Number(car.price) === stats.maxPrice?
                'The most expensive car':
                Number(car.price) === stats.minPrice?
                'The cheapest car':
                Math.abs(Number(car.price)-stats.avgPrice) < 100?
                'The average price car':
                ''}
            </div>   
            <div className="car-actions">
                <button onClick={() => navigate(`/edit/${car.id}`)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(car.id)} className="delete-btn">Delete</button>
            </div>
            </div>
        ))}
        </div>
    );
};

export default CarListComponent;
