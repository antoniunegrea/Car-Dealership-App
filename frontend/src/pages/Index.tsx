import CarListComponent from '../components/CarListComponent';
import HeaderComponent from '../components/HeaderComponent'
import Car from '../model/Car'
import {SortField, SortOrder} from '../model/Types'
import SortingComponent from '../components/SortingComponent';
import '../styles/index.css'


interface IndexProps{
    cars: Car[];
    handleDelete: (id: number) => void;
    sortField: SortField;
    setSortField: (sortField: SortField) => void;
    sortOrder: SortOrder;
    setSortOrder: (sortOrder: SortOrder) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}


const Index: React.FC<IndexProps> = ({ cars, handleDelete, sortField, setSortField, sortOrder, setSortOrder, searchTerm, setSearchTerm}) => {
    return (
        <div className='components-container'>
            <HeaderComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className='body-container'>
                <SortingComponent
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={(field, order) => {
                    setSortField(field);
                    setSortOrder(order);
                    }}
                />
                <CarListComponent cars={cars} onDelete={handleDelete}/>
            </div>
        </div>
    );
}

export default Index;