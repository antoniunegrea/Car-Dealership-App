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
    isServerOnline: boolean;
}


const Index: React.FC<IndexProps> = ({ cars, handleDelete, sortField, setSortField, sortOrder, setSortOrder, searchTerm, setSearchTerm, isServerOnline}) => {
    return (
        <div className='components-container'>
            <HeaderComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className='body-container'>
                <div
                    className='server-status'
                    style={{
                        backgroundColor: isServerOnline ? 'transparent' : 'red',
                        height: isServerOnline? '0px' : '50px',
                        alignContent: 'center',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        transition: 'all 0.3s ease',
                    }}
                    >
                    {!isServerOnline && 'Server is offline'}
                </div>
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