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
    sortField: SortField;
    setSortField: (sortField: SortField) => void;
    sortOrder: SortOrder;
    setSortOrder: (sortOrder: SortOrder) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
}


const Index: React.FC<IndexProps> = ({ cars, handleDelete, sortField, setSortField, sortOrder, setSortOrder, searchTerm, setSearchTerm}) => {
    /*const sortedCars = useMemo(() => {
        const sorted = [...cars].sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
        return sorted;
      }, [cars, sortField, sortOrder]);
    */
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