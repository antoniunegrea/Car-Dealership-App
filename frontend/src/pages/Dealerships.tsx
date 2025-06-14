import DealershipListComponent from '../components/DealershipListComponent';
import Dealership from '../model/Dealership'
import {SortField, SortOrder} from '../model/Types'
import SortingDealershipComponent from '../components/SortingDealershipComponent';
import '../styles/index.css'
import HeaderComponentDealerships from '../components/HeaderComponentDealerships';


interface DealershipsProps{
    dealerships: Dealership[];
    handleDelete: (id: number) => void;
    sortField: SortField;
    setSortField: (sortField: SortField) => void;
    sortOrder: SortOrder;
    setSortOrder: (sortOrder: SortOrder) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    isServerOnline: boolean;
    selectedDealershipId: number | null;
    setSelectedDealershipId: (dealershipId: number | null) => void;
}


const Dealerships: React.FC<DealershipsProps> = ({ dealerships, handleDelete, sortField, setSortField, sortOrder, setSortOrder, searchTerm, setSearchTerm, isServerOnline, selectedDealershipId, setSelectedDealershipId}) => {
    return (
        <div className='components-container'>
            <HeaderComponentDealerships searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className='body-container'>
                {!isServerOnline && (
                    <div className='server-status'>
                        Server is offline
                    </div>
                )}
                <SortingDealershipComponent
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={(field, order) => {
                    setSortField(field);
                    setSortOrder(order);
                    }}
                />
                <DealershipListComponent dealerships={dealerships} onDelete={handleDelete} selectedDealershipId={selectedDealershipId} setSelectedDealershipId={setSelectedDealershipId}/>
            </div>
        </div>
    );
}

export default Dealerships;