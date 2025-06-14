import CarListComponent from '../components/CarListComponent';
import HeaderComponent from '../components/HeaderComponent'
import Car from '../model/Car'
import {SortField, SortOrder} from '../model/Types'
import SortingComponent from '../components/SortingComponent';
import '../styles/index.css'
import CarService from '../service/CarService';

interface IndexProps {
    cars: Car[];
    handleDelete: (id: number) => void;
    sortField: SortField;
    setSortField: (sortField: SortField) => void;
    sortOrder: SortOrder;
    setSortOrder: (sortOrder: SortOrder) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    isServerOnline: boolean;
    carService: CarService;
}

const Index: React.FC<IndexProps> = ({ 
    cars, 
    handleDelete, 
    sortField, 
    setSortField, 
    sortOrder, 
    setSortOrder, 
    searchTerm, 
    setSearchTerm, 
    isServerOnline, 
    carService
}) => {
    return (
        <div className='components-container'>
            <HeaderComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className='body-container'>
                {!isServerOnline && (
                    <div className='server-status'>
                        Server is offline
                    </div>
                )}
                <SortingComponent
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={(field, order) => {
                        setSortField(field);
                        setSortOrder(order);
                    }}
                />
                <CarListComponent 
                    cars={cars} 
                    onDelete={handleDelete} 
                    carService={carService}
                />
            </div>
        </div>
    );
}

export default Index;