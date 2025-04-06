import React, { useState, useMemo } from 'react';
import CarListComponent from '../components/CarListComponent';
import HeaderComponent from '../components/HeaderComponent'
import Car from '../model/Car'
import {SortField, SortOrder} from '../model/Types'
import SortingComponent from '../components/SortingComponent';
import '../styles/index.css'


interface IndexProps{
    cars: Car[];
    handleDelete: (id: number) => void;
}


const Index: React.FC<IndexProps> = ({ cars, handleDelete }) => {
    const [sortField, setSortField] = useState<SortField>('manufacturer');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const sortedCars = useMemo(() => {
        const sorted = [...cars].sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
        return sorted;
      }, [cars, sortField, sortOrder]);

    return (
        <div className='components-container'>
            <HeaderComponent/>
            <div className='body-container'>
                <SortingComponent
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={(field, order) => {
                    setSortField(field);
                    setSortOrder(order);
                    }}
                />
                <CarListComponent cars={sortedCars} onDelete={handleDelete}/>
            </div>
        </div>
    );
}

export default Index;